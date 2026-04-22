#!/usr/bin/env python3
import argparse
import json
import math
import os
from collections import Counter

from PIL import Image, ImageFilter, ImageStat


def parse_args():
    parser = argparse.ArgumentParser(description="Analyze screenshot metadata for style extraction.")
    parser.add_argument("--image", required=True, help="Path to the input image.")
    parser.add_argument("--out", required=True, help="Output directory.")
    return parser.parse_args()


def rgb_to_hex(rgb):
    return "#{:02x}{:02x}{:02x}".format(*rgb)


def dominant_colors(image, top_n=8):
    reduced = image.convert("RGB").resize((200, 200))
    pixels = list(reduced.getdata())
    quantized = []
    for r, g, b in pixels:
        quantized.append((round(r / 16) * 16, round(g / 16) * 16, round(b / 16) * 16))
    common = Counter(quantized).most_common(top_n)
    return [rgb_to_hex(color) for color, _ in common]


def brightness_profile(image, sample_rows=40):
    gray = image.convert("L")
    width, height = gray.size
    result = []
    for i in range(sample_rows):
        y = min(height - 1, round(i * (height - 1) / max(1, sample_rows - 1)))
        row = gray.crop((0, y, width, y + 1))
        mean = ImageStat.Stat(row).mean[0]
        result.append({"row_index": i, "y": y, "brightness": round(mean, 2)})
    return result


def whitespace_ratio(image):
    gray = image.convert("L")
    pixels = list(gray.getdata())
    bright = sum(1 for p in pixels if p >= 245)
    return round(bright / max(1, len(pixels)), 4)


def edge_density(image):
    edges = image.convert("L").filter(ImageFilter.FIND_EDGES)
    pixels = list(edges.getdata())
    strong = sum(1 for p in pixels if p >= 40)
    return round(strong / max(1, len(pixels)), 4)


def section_breaks(image, sample_rows=120):
    gray = image.convert("L")
    width, height = gray.size
    values = []
    for i in range(sample_rows):
        y = min(height - 1, round(i * (height - 1) / max(1, sample_rows - 1)))
        row = gray.crop((0, y, width, y + 1))
        mean = ImageStat.Stat(row).mean[0]
        values.append((y, mean))

    breaks = []
    for index in range(1, len(values)):
        prev_y, prev_mean = values[index - 1]
        y, mean = values[index]
        diff = abs(mean - prev_mean)
        if diff >= 18:
            breaks.append({
                "y": y,
                "brightness_delta": round(diff, 2)
            })
    return breaks[:20]


def guess_page_tone(palette, whitespace, edges):
    dark_colors = 0
    bright_colors = 0
    for value in palette:
        r = int(value[1:3], 16)
        g = int(value[3:5], 16)
        b = int(value[5:7], 16)
        brightness = (0.299 * r + 0.587 * g + 0.114 * b)
        if brightness <= 70:
            dark_colors += 1
        if brightness >= 210:
            bright_colors += 1

    if dark_colors >= 3 and whitespace < 0.35:
        return "dark"
    if bright_colors >= 3 and whitespace >= 0.30:
        return "light"
    return "mixed"


def main():
    args = parse_args()
    os.makedirs(args.out, exist_ok=True)

    image = Image.open(args.image)
    width, height = image.size
    palette = dominant_colors(image)
    tone = guess_page_tone(palette, whitespace_ratio(image), edge_density(image))

    meta = {
        "source_type": "image",
        "input_path": os.path.abspath(args.image),
        "dimensions": {
            "width": width,
            "height": height,
            "aspect_ratio": round(width / max(1, height), 4)
        },
        "dominant_colors": palette,
        "brightness_profile": brightness_profile(image),
        "whitespace_ratio": whitespace_ratio(image),
        "edge_density": edge_density(image),
        "section_break_candidates": section_breaks(image),
        "tone_guess": tone,
        "notes": [
            "This metadata is image-derived and does not contain DOM structure.",
            "Use it as supporting evidence for style inference, not as source-code evidence."
        ]
    }

    output_path = os.path.join(args.out, "image-meta.json")
    with open(output_path, "w", encoding="utf-8") as f:
      json.dump(meta, f, ensure_ascii=False, indent=2)

    print(json.dumps({
        "ok": True,
        "file": output_path
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
