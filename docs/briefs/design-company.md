# Task: redesign inferedgeai.com (apps/company, static, no build step)
Follow docs/briefs/design-common.md. Edit only apps/company. Preview: python3 -m http.server 8080 -d apps/company
Pages: home, about, leaderboard, research, edge-ai, english-to-telugu. Share one stylesheet at apps/company/assets/site.css and one header and footer pattern.
Home order: 1) plain statement of what InferEdge does, with demo link and leaderboard link; 2) live-looking product panel for VaayuEdge using the existing example sentence; 3) top rows of the real translation leaderboard, linking to the full page; 4) dated research index; 5) short honest "what we are building" with no dates or promised scores; 6) contact.
Leaderboard: comparison quality on par with a data site: sticky header, category tabs or anchors, sortable columns with vanilla JS, a size filter, our rows clearly marked, tables readable on phones. "No ranking yet" states must stay visible.
Done when: every page is consistent, links work, sitemap valid, no console errors, screenshots saved.
