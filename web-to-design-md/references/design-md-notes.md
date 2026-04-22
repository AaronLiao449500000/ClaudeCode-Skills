# design-md notes

This repository uses `DESIGN.md` as an AI-readable design-language reference file.

The goal of `DESIGN.md` is not to archive every CSS rule from a page.  
The goal is to describe a design language in a way that can be applied to future pages, sections, cards, articles, or landing screens.

A good `DESIGN.md` should:

- describe transferable visual principles
- define color roles instead of raw disconnected color lists
- define typography hierarchy instead of vague “nice font” language
- explain spacing rhythm and layout pacing
- document component recipes
- include do / don't constraints
- include prompt-ready guidance so models can reuse the style consistently

A weak `DESIGN.md` usually fails in one of these ways:

- it summarizes page content instead of style
- it lists tokens without describing how they work together
- it uses adjectives without implementation rules
- it overclaims exactness from a screenshot
- it omits uncertainty

This repository therefore separates:
- clone outputs
- style outputs
- hybrid outputs

and forces everything through an intermediate `style-map.json`.
