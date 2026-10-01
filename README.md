# Yiquan Wang's Academic Homepage

Personal academic website for Yiquan Wang (王一权), featuring research in AI for Science, computational biology, and mathematical physics.

**Website:** [wyqmath.cn](https://wyqmath.cn/)

The site uses plain HTML, CSS, and JavaScript. No application build step is required.

## Pages

| Page | Content |
| --- | --- |
| `index.html` | Personal profile, education and visiting student appointments, featured research, personal profile links, mentors and collaborators, and institutions. |
| `publications.html` | Publications grouped by year, title search, research area filters, and a year navigation rail. |
| `experience.html` | Research projects, reviewer service, learning experiences, internships, awards, and other activities. |
| `funzone.html` | Interactive mathematics and science demonstrations. |

The three academic pages provide English and Chinese versions. English is displayed by default. Light and dark themes follow the system preference until a theme is selected manually; that choice is saved in the browser.

## Layout and Typography

The academic pages share a fixed 1,200px page layout with a centered 920px content column. The same layout is used across screen sizes, with a fixed viewport for viewing the page on smaller devices. Columns and navigation do not move to alternative positions at narrow screen widths.

The main navigation scrolls away with the page. On the Publications page, the year navigation stays in the left margin and remains available while scrolling through the publication list.

Shared typography is defined in `assets/script.css`:

| Role | CSS variable | Size |
| --- | --- | --- |
| Page title | `--type-page-title` | 35px |
| Section heading | `--type-section` | 18px |
| Entry title | `--type-item` | 15px |
| Body text and descriptive information | `--type-body` | 13px |
| Dates, category tags, and compact controls | `--type-meta` | 12px |

Entry titles use a font weight of 600 and a line height of 1.5. Body text uses a line height of 1.65. Shared spacing values are maintained in `assets/spacing.css`.

Personal profile links appear below the contact details on the homepage, using the original platform logos. Mentors, collaborators, and institution links appear in the final homepage section. Institution links use two columns, with separate links for Tsinghua University, TEEP, and Shenzhen X-Institute.

## Publications

- Papers are grouped by year, from newest to oldest. Searching and filtering preserve their order within each year.
- The left year navigation shows the number of visible papers in each year, jumps to that year's section, and highlights the current reading position.
- Title search accepts partial keywords and multiple keywords. It ignores case, punctuation, and diacritics, and tolerates small spelling errors, including adjacent letter swaps.
- Search applies to paper titles only, and can be combined with a research area filter.
- The buttons above the list filter by Computational biology, Mathematical physics & biological complexity, or Interdisciplinary explorations.
- Colored category tags beside individual papers are descriptive labels. They do not filter results or trigger scrolling.
- Years with no matching papers are hidden. An empty result includes an option to clear the search and display all papers.
- Search text and the selected filter are retained when switching between English and Chinese.

## Repository Structure

```text
.
├── index.html          # Homepage
├── publications.html   # Publication list and discovery controls
├── experience.html     # Research and academic experience
├── funzone.html        # Interactive demonstrations
├── assets/
│   ├── spacing.css     # Shared spacing values
│   ├── script.css      # Academic page styles and typography
│   ├── script.js       # Language, theme, title search, filters, and year navigation
│   └── ...             # Additional site assets, including the social sharing image
├── figures/            # Research figures
├── photos/             # Profile photo and institution logos
├── pub/                # Publication and patent PDFs
├── cv/                 # LaTeX CV and academic card source files
├── package.json        # Deployment runtime declaration: Node.js 24.x
├── favicon.ico
├── apple-touch-icon.png
├── robots.txt
└── sitemap.xml
```

## Local Preview

Open `index.html` directly in a browser. There is no dependency installation or compilation step.

Alternatively, serve the repository directory with Python:

```sh
python -m http.server 8000
```

Then visit [localhost:8000](http://localhost:8000/).

If an existing browser tab still displays an older layout after a change, reload the page. The academic HTML files include versioned CSS and JavaScript URLs to refresh cached assets.

## Updating Content

1. Edit the relevant HTML page and keep its English and Chinese versions in sync.
2. For publications, place each entry in the appropriate `.publication-year` section and keep its `data-year` consistent with that section. Use `data-direction="1"`, `"2"`, or `"3"` for the three research areas.
3. Use the same `data-paper-id` for a paper in both language versions. Preserve the `.publication-title`, `.publication-authors`, `.publication-venue`, and `.publication-tag` elements.
4. When adding a year, add its section and navigation link to both language versions. Use distinct section IDs for each language, and point the corresponding year links to those IDs. Visible counts are recalculated by JavaScript.
5. Keep individual paper tags as `<span>` elements. Filtering belongs to the toolbar buttons.
6. Make shared design changes in `assets/script.css` and `assets/spacing.css`. Increment the relevant asset version in all three academic HTML files when changing shared CSS or JavaScript.
7. Preview the affected pages in both languages and themes before publishing.

Journal reviewer entries on the Experience page are listed alphabetically. Journals appear on the left and conference workshops on the right. Project abstracts use expandable sections.

## Deployment

The repository is connected to Vercel. Pushing changes to the configured GitHub branch triggers deployment.

`package.json` declares Node.js `24.x` for the deployment environment. The Vercel project's Node.js version should also be set to `24.x` under **Settings → Build and Deployment → Node.js Version**. Runtime changes apply to subsequent deployments.

Local previews do not require Node.js.
