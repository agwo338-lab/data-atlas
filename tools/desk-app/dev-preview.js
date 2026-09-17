'use strict';

// Design harness. In Electron, preload.js has already defined window.desk by
// the time this runs, so this file does nothing at all.
//
// It only takes effect when index.html is opened outside Electron — serving
// tools/desk-app/ with any static file server, which is how the layout gets
// checked without booting the app. The sample notes below are fiction and
// are labelled as such in the UI, so a preload failure inside Electron shows
// up as obviously-fake content rather than passing as a real record.

if (!window.desk) {
  const SAMPLE = [
    {
      slug: '2026-09-12-sample-aws-candidates',
      date: '2026-09-12',
      agent: 'research-agent',
      topic: 'SAMPLE — Three candidate AWS sites',
      asked: 'add three more aws sites',
      applied: '2 of 3 written to data/sites.js; the third left out, sources conflicted on the county',
      commit: 'abc1234',
      run: '',
      body:
        'This is sample content for design work, not a real research note.\n\n' +
        'I spent most of this on the permitting trail rather than the news, which ' +
        'worked better than expected: two of the three turned up in county dockets ' +
        'before anyone announced anything, so location and status sit on firmer ' +
        'ground than the capacity figures do.\n\n' +
        'One conflict, and an annoying one. Two otherwise-credible write-ups put the ' +
        'same campus in different counties and I could not find a parcel record that ' +
        'settles it, so I left that entry alone rather than pick a winner. The ' +
        'capacity numbers across all three are operator-disclosed and nothing ' +
        'independent touches them.\n\n' +
        'Another hour and I would go at the ERCOT large-load queue for the Texas one.',
    },
    {
      slug: '2026-09-04-sample-equinix-recheck',
      date: '2026-09-04',
      agent: 'research-agent',
      topic: 'SAMPLE — Equinix Kristiansand re-check',
      asked: '/reconcile',
      applied: 'No change. Status confirmed still Operational; lastUpdated refreshed.',
      commit: 'def5678',
      run: '',
      body:
        'Sample content for design work.\n\n' +
        'Nothing has moved here since the entry was written. PeeringDB still lists ' +
        'the facility with the same address and network count, which is about as ' +
        'good as existence evidence gets. No conflicts, nothing surprising.\n\n' +
        'Worth saying plainly that the capacity figure is still the same operator ' +
        'press release it always was. It has not got worse, but a year of it being ' +
        'unchallenged is not the same as it being confirmed.',
    },
    {
      slug: '2026-08-28-sample-coreweave-news',
      date: '2026-08-28',
      agent: 'news-agent',
      topic: 'SAMPLE — CoreWeave headlines',
      asked: "what's new with coreweave",
      applied: 'Four headlines added to data/news.js.',
      commit: '9abcdef',
      run: '',
      body:
        'Sample content for design work.\n\n' +
        'Busy quarter, and most of the coverage traces back to two announcements ' +
        'that got recycled a lot. I kept the four that actually added something and ' +
        'dropped the rest as restatements. No conflicts.',
    },
  ];

  window.desk = {
    notes: async () => ({
      deskPath: '(design preview — not reading the real desk)',
      hasDesk: true,
      runCount: 1,
      notes: SAMPLE,
    }),
    run: async () => 'Sample archived report body.',
    // Same shape main.js's readCoverage() returns: per operator, the tracked
    // sites as rows, the roster's leads, and one numbered source list the
    // superscripts in both point into.
    coverage: async () => ({
      hasFile: true,
      compiled: '2026-09-12',
      tracked: { ok: true },
      operators: [
        {
          name: 'SAMPLE Operator A',
          heading: 'SAMPLE Operator A',
          listed: 4,
          color: '#4C6FE5',
          live: { total: 2, operational: 1, building: 1, planned: 0 },
          rows: [
            {
              kind: 'tracked', name: 'SAMPLE Site One', place: 'Nowhere, Sampleland',
              status: 'Operational', capacity: '120 MW', derived: false,
              verdict: 'Independently verified', verdictKey: 'independent',
              level: 'High', color: '#4ADE80', refs: [1, 2],
              fields: [{ label: 'Capacity', verdict: 'Independently verified', level: 'High' }],
            },
            {
              kind: 'tracked', name: 'SAMPLE Site Two', place: 'Elsewhere, Sampleland',
              status: 'Under construction', capacity: '45 MW', derived: true,
              verdict: "Operator's word", verdictKey: 'operator',
              level: 'Medium', color: '#FBBF24', refs: [2],
              fields: [{ label: 'Capacity', verdict: "Operator's word", level: 'Medium' }],
            },
          ],
          leads: [
            {
              kind: 'lead', grade: 'high', done: false, name: 'SAMPLE lead site',
              status: 'Planned', capacity: '80 MW', detail:
                'A site reported to exist but not yet vetted. This is sample content for design work.',
              refs: [3],
            },
            {
              kind: 'lead', grade: 'medium', done: true, name: 'SAMPLE lead, since added',
              status: '', capacity: '', detail: 'Already researched and written into data/sites.js.',
              refs: [],
            },
            {
              kind: 'watch', grade: 'watch', done: false, name: 'SAMPLE watch-only item',
              status: '', capacity: '', detail: 'Looked at, no citable source, left alone.',
              refs: [],
            },
          ],
          sources: [
            { n: 1, label: 'SAMPLE county permit docket', url: 'https://example.invalid/permit', host: 'example.invalid' },
            { n: 2, label: 'SAMPLE trade press write-up', url: 'https://example.invalid/trade', host: 'example.invalid' },
            { n: 3, label: 'SAMPLE operator announcement', url: 'https://example.invalid/press', host: 'example.invalid' },
          ],
        },
        {
          name: 'SAMPLE Operator B',
          heading: 'SAMPLE Operator B',
          listed: null,
          color: '#E0A752',
          live: { total: 1, operational: 0, building: 0, planned: 1 },
          rows: [
            {
              kind: 'tracked', name: 'SAMPLE Site Three', place: 'Far Away, Sampleland',
              status: 'Planned', capacity: '', derived: false,
              verdict: 'Unsourced', verdictKey: 'unsourced',
              level: 'Unverified', color: '#8FA39C', refs: [],
              fields: [{ label: 'Status', verdict: 'Unsourced', level: 'Unverified' }],
            },
          ],
          leads: [],
          sources: [],
        },
      ],
    }),
    reveal: async () => {},
    onChange: () => {},
  };
}
