/*
 * experiment.js (improved version)
 *
 * This file defines a multi‑stimulus League of Legends cue search experiment
 * using jsPsych. It improves the user interface with cleaner layouts,
 * explanatory instructions for the confidence slider, a built‑in survey
 * shown before the task, and more explicit control over how the
 * confidence slider is updated. The slider now ranges from –100 to 100
 * with descriptive labels for each end and the midpoint. Participants
 * must move the slider after each cue reveal before they can reveal
 * another cue or make a final decision, preventing accidental clicks
 * from recording a confidence update.
 */

// Initialise jsPsych. Display collected data at the end for
// development. Replace displayData() with custom data handling in
// production.
const EDIT_MODE = new URLSearchParams(window.location.search).get('edit') === '1';
const app = document.getElementById('jspsych-target');
const jsPsych = initJsPsych({
  display_element: 'jspsych-target'
});

/*
 * Stimuli definition.
 * Each stimulus represents a single trial. To add more trials, append
 * additional objects to this array. Each cue may include an optional
 * `overlay` specifying the position and size of its opaque box as
 * percentages relative to the screenshot container. If no overlay is
 * provided, a default small box will be used.
 */
const stimuli = [
  {
    id: 'trial1',
    screenshot: 'assets/screenshot1.png',
    role_prompt: 'You are the blue-side shotcaller. What would you call here?',
    baseline: {
      description:
        'Champion identities, lane positions, minion wave state, turrets and terrain are visible. Health bars are shown on the champions.'
    },
    cues: [
      {
        id: 'blue_champ_portrait',
        label: 'Blue Champion Portrait',
        reveal_group: 'champ_portrait',
        overlay: { top: '11.34%', left: '0.00%', width: '4.99%', height: '47.83%' }
      },
      {
        id: 'red_champ_portrait',
        label: 'Red Champion Portrait',
        reveal_group: 'champ_portrait',
        overlay: { top: '12.43%', left: '93.31%', width: '6.37%', height: '45.95%' }
      },
      {
        id: 'blue_items',
        label: 'Blue Items',
        reveal_group: 'blue_items_group',
        overlay: { top: '79.35%', left: '29.64%', width: '17.54%', height: '20.22%' }
      },
      {
        id: 'red_items',
        label: 'Red Items',
        reveal_group: 'red_items_group',
        overlay: { top: '79.16%', left: '53.15%', width: '15.70%', height: '20.41%' }
      },
      {
        id: 'blue_ad_hp',
        label: 'HP',
        reveal_group: 'health_cluster',
        overlay: { top: '41.99%', left: '44.19%', width: '7.82%', height: '2.38%' }
      },
      {
        id: 'blue_sup_hp',
        label: 'HP',
        reveal_group: 'health_cluster',
        overlay: { top: '52.74%', left: '45.81%', width: '8.86%', height: '3.00%' }
      },
      {
        id: 'red_jg_hp',
        label: 'HP',
        reveal_group: 'health_cluster',
        overlay: { top: '7.73%', left: '28.66%', width: '7.12%', height: '1.76%' }
      },
      {
        id: 'red_ad_hp',
        label: 'HP',
        reveal_group: 'health_cluster',
        overlay: { top: '21.59%', left: '79.07%', width: '6.66%', height: '3.41%' }
      },
      {
        id: 'red_sup_hp',
        label: 'HP',
        reveal_group: 'health_cluster',
        overlay: { top: '20.73%', left: '62.38%', width: '9.32%', height: '2.79%' }
      },
      {
        id: 'scoreboard',
        label: 'Scoreboard',
        overlay: { top: '0.62%', left: '22.03%', width: '56.73%', height: '4.03%' }
      },
      {
        id: 'minimap',
        label: 'Minimap',
        overlay: { top: '74.04%', left: '83.71%', width: '15.58%', height: '25.53%' }
      },
    ]
  },
  {
    id: 'trial2',
    screenshot: 'assets/screenshot2.png',
    role_prompt: '',
    baseline: {
      description:
        'Your team composition, lane positioning and current health are shown. Turrets and minion waves are visible. Focus on map awareness when making your call.'
    },
    cues: [
      {
        id: 'blue_champ_portrait',
        label: 'Blue Champion Portrait',
        reveal_group: 'champ_portrait',
        overlay: { top: '11.56%', left: '0.23%', width: '4.99%', height: '47.83%' }
      },
      {
        id: 'red_champ_portrait',
        label: 'Red Champion Portrait',
        reveal_group: 'champ_portrait',
        overlay: { top: '13.88%', left: '93.40%', width: '6.37%', height: '45.95%' }
      },
      {
        id: 'blue_items',
        label: 'Blue Items',
        reveal_group: 'blue_items_group',
        overlay: { top: '79.35%', left: '29.64%', width: '17.54%', height: '20.22%' }
      },
      {
        id: 'red_items',
        label: 'Red Items',
        reveal_group: 'red_items_group',
        overlay: { top: '79.16%', left: '53.15%', width: '15.70%', height: '20.41%' }
      },
      {
        id: 'blue_top_hp2',
        label: 'HP',
        reveal_group: 'health_cluster',
        overlay: { top: '44.74%', left: '23.79%', width: '6.89%', height: '2.17%' }
      },
      {
        id: 'blue_jg_hp2',
        label: 'HP',
        reveal_group: 'health_cluster',
        overlay: { top: '21.64%', left: '80.92%', width: '7.82%', height: '2.38%' }
      },
      {
        id: 'blue_ad_hp2',
        label: 'HP',
        reveal_group: 'health_cluster',
        overlay: { top: '89.45%', left: '16.50%', width: '7.82%', height: '2.38%' }
      },
      {
        id: 'blue_sup_hp2',
        label: 'HP',
        reveal_group: 'health_cluster',
        overlay: { top: '50.19%', left: '39.32%', width: '7.82%', height: '1.97%' }
      },
      {
        id: 'red_top_hp2',
        label: 'HP',
        reveal_group: 'health_cluster',
        overlay: { top: '22.58%', left: '47.55%', width: '7.12%', height: '1.76%' }
      },
      {
        id: 'red_jg_hp2',
        label: 'HP',
        reveal_group: 'health_cluster',
        overlay: { top: '15.79%', left: '44.41%', width: '6.54%', height: '1.55%' }
      },
      {
        id: 'red_mid_hp2',
        label: 'HP',
        reveal_group: 'health_cluster',
        overlay: { top: '53.82%', left: '66.20%', width: '6.54%', height: '2.17%' }
      },
      {
        id: 'red_ad_hp2',
        label: 'HP',
        reveal_group: 'health_cluster',
        overlay: { top: '22.70%', left: '43.49%', width: '7.12%', height: '2.59%' }
      },
      {
        id: 'red_sup_hp2',
        label: 'HP',
        reveal_group: 'health_cluster',
        overlay: { top: '25.28%', left: '48.36%', width: '7.81%', height: '1.76%' }
      },
      {
        id: 'scoreboard2',
        label: 'Scoreboard',
        overlay: { top: '0.62%', left: '22.03%', width: '56.73%', height: '4.03%' }
      },
      {
        id: 'minimap',
        label: 'Minimap',
        overlay: { top: '74.04%', left: '83.71%', width: '15.58%', height: '25.53%' }
      }
    ]
  }
];

// High‑resolution timer for timestamps.
const experimentStart = performance.now();

function cueRevealGroup(cue) {
  return cue.reveal_group || cue.revealGroup || cue.id;
}

function cuesTriggeredByClick(stimulus, clickedCueId) {
  const clickedCue = stimulus.cues.find((cue) => cue.id === clickedCueId);
  if (!clickedCue) return [clickedCueId];
  const group = cueRevealGroup(clickedCue);
  return stimulus.cues
    .filter((cue) => cueRevealGroup(cue) === group)
    .map((cue) => cue.id);
}

function uniquePushAll(targetArray, values) {
  values.forEach((value) => {
    if (!targetArray.includes(value)) targetArray.push(value);
  });
}

function downloadTextFile(filename, text) {
  const mimeType = filename.toLowerCase().endsWith('.csv')
    ? 'text/csv;charset=utf-8'
    : 'text/plain;charset=utf-8';
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function pct(value) {
  return `${value.toFixed(2)}%`;
}

function csvEscape(value) {
  const stringValue = value == null ? '' : String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function safeJsonParse(value, fallback) {
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function flattenRevealOrder(revealOrder) {
  return revealOrder.map((entry) => entry.cue_id).join(' | ');
}

function flattenRevealGroups(revealOrder) {
  return revealOrder.map((entry) => entry.reveal_group || '').join(' | ');
}

function flattenRevealedCueSets(revealOrder) {
  return revealOrder
    .map((entry) => Array.isArray(entry.revealed_cue_ids) ? entry.revealed_cue_ids.join('&') : '')
    .join(' | ');
}

function flattenRevealTimes(revealOrder) {
  return revealOrder.map((entry) => Math.round(Number(entry.time) || 0)).join(' | ');
}

function getJatosMetadata() {
  if (typeof jatos === 'undefined') {
    return {
      worker_id: '',
      study_id: '',
      study_result_id: '',
      component_id: '',
      component_result_id: ''
    };
  }

  return {
    worker_id: jatos.workerId ?? '',
    study_id: jatos.studyId ?? '',
    study_result_id: jatos.studyResultId ?? '',
    component_id: jatos.componentId ?? '',
    component_result_id: jatos.componentResultId ?? ''
  };
}

function buildCsvResult() {
  const rows = jsPsych.data.get().values();
  const surveyResponse = rows.find((row) => row.trial_type === 'survey-text')?.response ?? {};
  const decisionRows = rows.filter((row) => row.event_type === 'decision');
  const metadata = getJatosMetadata();
  const headers = [
    'worker_id',
    'study_id',
    'study_result_id',
    'component_id',
    'component_result_id',
    'stimulus_id',
    'screenshot',
    'role_prompt',
    'decision',
    'final_confidence',
    'rationale',
    'decision_rt_ms',
    'decision_timestamp_ms',
    'num_cues_revealed',
    'cues_revealed',
    'reveal_click_order',
    'reveal_groups',
    'revealed_cue_sets',
    'overlay_confidence_sequence',
    'reveal_timestamps_ms',
    'survey_rank',
    'survey_current_rank',
    'survey_opgg',
    'survey_hours_per_week',
    'survey_playstyle',
    'survey_primary_role',
    'survey_otp',
    'survey_competitive_experience'
  ];

  const csvRows = decisionRows.map((row) => {
    const revealOrder = safeJsonParse(row.reveal_order, []);
    const cuesRevealed = safeJsonParse(row.cues_revealed, []);
    const revealConfidence = safeJsonParse(row.reveal_confidence, []);
    const stimulusMeta = stimuli.find((stimulus) => stimulus.id === row.stimulus_id) ?? {};

    return [
      metadata.worker_id,
      metadata.study_id,
      metadata.study_result_id,
      metadata.component_id,
      metadata.component_result_id,
      row.stimulus_id ?? '',
      stimulusMeta.screenshot ?? '',
      stimulusMeta.role_prompt ?? '',
      row.decision ?? '',
      row.confidence ?? '',
      row.rationale ?? '',
      row.rt ?? '',
      Math.round(Number(row.time) || 0),
      row.num_cues_revealed ?? 0,
      Array.isArray(cuesRevealed) ? cuesRevealed.join(' | ') : '',
      flattenRevealOrder(revealOrder),
      flattenRevealGroups(revealOrder),
      flattenRevealedCueSets(revealOrder),
      Array.isArray(revealConfidence) ? revealConfidence.join(' | ') : '',
      flattenRevealTimes(revealOrder),
      surveyResponse.rank ?? '',
      surveyResponse.current_rank ?? '',
      surveyResponse.opgg ?? '',
      surveyResponse.hours ?? '',
      surveyResponse.playstyle ?? '',
      surveyResponse.role ?? '',
      surveyResponse.otp ?? '',
      surveyResponse.competitive ?? ''
    ].map(csvEscape).join(',');
  });

  return [headers.join(','), ...csvRows].join('\n');
}

function buildImageWithRemovedCues(stimulus, revealedCueIds) {
  const remainingCues = stimulus.cues.filter((c) => !revealedCueIds.includes(c.id));

  let html = `
    <div class="screen-wrap">
      <h3>${stimulus.role_prompt}</h3>
      <div class="screenshot-container" id="participant-screenshot-container">
        <img src="${stimulus.screenshot}" alt="League screenshot" />
  `;

  remainingCues.forEach((cue) => {
    const overlay = cue.overlay;
    html += `
      <div
        class="cue-overlay"
        style="
          top:${overlay.top};
          left:${overlay.left};
          width:${overlay.width};
          height:${overlay.height};
        "
      ></div>
    `;
  });

  html += `</div></div>`;
  return html;
}

function renderCalibrationApp() {
  let currentStimulusIndex = 0;
  let activeCueId = null;

  function currentStimulus() {
    return stimuli[currentStimulusIndex];
  }

  function buildOverlayBox(cue) {
    const overlay = cue.overlay;
    const isActive = activeCueId === cue.id;
    return `
      <div
        class="cue-overlay calibration-box"
        data-cue-id="${cue.id}"
        style="
          top:${overlay.top};
          left:${overlay.left};
          width:${overlay.width};
          height:${overlay.height};
          outline:${isActive ? '2px solid #4da3ff' : '1px solid rgba(255,255,255,0.35)'};
          cursor: move;
          display:flex;
          align-items:center;
          justify-content:center;
        "
      >
        <span class="cue-overlay-label">${cue.id}</span>
        <div class="resize-handle" data-resize-id="${cue.id}"></div>
      </div>
    `;
  }

  function codeString(value) {
    return `'${String(value ?? '')
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")}'`;
  }

  function formatCueForCode(cue, indent = '      ') {
    const lines = [
      `${indent}{`,
      `${indent}  id: ${codeString(cue.id)},`,
      cue.label ? `${indent}  label: ${codeString(cue.label)},` : null,
      cue.reveal_group ? `${indent}  reveal_group: ${codeString(cue.reveal_group)},` : null,
      cue.present === false ? `${indent}  present: false,` : null,
      `${indent}  overlay: { top: ${codeString(cue.overlay?.top ?? '0%')}, left: ${codeString(cue.overlay?.left ?? '0%')}, width: ${codeString(cue.overlay?.width ?? '10%')}, height: ${codeString(cue.overlay?.height ?? '10%')} }`,
      `${indent}}`
    ].filter(Boolean);

    return lines.join('\n');
  }

  function formatCueArrayForCode(cues, baseIndent = '    ') {
    const cueIndent = baseIndent + '  ';
    return `${baseIndent}cues: [\n${cues.map((cue) => formatCueForCode(cue, cueIndent)).join(',\n')}\n${baseIndent}]`;
  }

  function formatAllStimuliForCode(stimuliArray) {
    return stimuliArray
      .map((stimulus) => {
        return `// ${stimulus.id}\n${formatCueArrayForCode(stimulus.cues, '    ')}`;
      })
      .join('\n\n');
  }

  function currentStimulusOverlayCode() {
    return formatCueArrayForCode(currentStimulus().cues);
  }

  function allStimuliOverlayCode() {
    return formatAllStimuliForCode(stimuli);
  }

  function rerender() {
    const stimulus = currentStimulus();
    app.innerHTML = `
      <div class="editor-panel center-wrap">
        <h2>Overlay calibration mode</h2>
        <p class="hint">
          This mode only appears at <code>?edit=1</code>. Participants cannot drag or resize boxes.
        </p>
        <div class="editor-toolbar">
          <button id="prev-stimulus" class="jspsych-btn">Previous stimulus</button>
          <strong>${stimulus.id}</strong>
          <button id="next-stimulus" class="jspsych-btn">Next stimulus</button>
          <button id="copy-current" class="jspsych-btn">Copy current stimulus code</button>
          <button id="copy-all" class="jspsych-btn">Copy all stimuli code</button>
          <button id="export-current" class="jspsych-btn">Export current stimulus code</button>
          <button id="export-all" class="jspsych-btn">Export all stimuli code</button>
        </div>
        <p class="hint">
          Drag a black box to move it. Drag the white square in the lower-right corner to resize it.
        </p>
        <div class="screen-wrap">
          <h3>${stimulus.role_prompt}</h3>
          <div class="screenshot-container" id="calibration-container">
            <img src="${stimulus.screenshot}" alt="League screenshot" />
            ${stimulus.cues.map(buildOverlayBox).join('')}
          </div>
        </div>
        <div class="editor-panel">
          <h4>Selected cue</h4>
          <div id="selected-cue-readout">${activeCueId || 'None selected'}</div>
          <textarea id="overlay-output" class="copy-output">${currentStimulusOverlayCode()}</textarea>
          <p class="warning-text">After calibrating, copy the code and save it back into your source file.</p>
        </div>
      </div>
    `;

    const container = document.getElementById('calibration-container');
    const output = document.getElementById('overlay-output');

    document.getElementById('prev-stimulus').onclick = () => {
      currentStimulusIndex = (currentStimulusIndex - 1 + stimuli.length) % stimuli.length;
      activeCueId = null;
      rerender();
    };

    document.getElementById('next-stimulus').onclick = () => {
      currentStimulusIndex = (currentStimulusIndex + 1) % stimuli.length;
      activeCueId = null;
      rerender();
    };

    document.getElementById('copy-current').onclick = async () => {
      output.value = currentStimulusOverlayCode();
      try {
        await navigator.clipboard.writeText(output.value);
      } catch (err) { }
    };

    document.getElementById('copy-all').onclick = async () => {
      output.value = allStimuliOverlayCode();
      try {
        await navigator.clipboard.writeText(output.value);
      } catch (err) { }
    };

    document.getElementById('export-current').onclick = () => {
      output.value = currentStimulusOverlayCode();
      downloadTextFile(`${stimulus.id}-overlays.js`, output.value);
    };

    document.getElementById('export-all').onclick = () => {
      output.value = allStimuliOverlayCode();
      downloadTextFile('all-stimuli-overlays.js', output.value);
    };

    const boxes = container.querySelectorAll('.calibration-box');

    function setActiveCue(cueId) {
      activeCueId = cueId;
      const readout = document.getElementById('selected-cue-readout');
      if (readout) readout.textContent = cueId || 'None selected';
      boxes.forEach((candidate) => {
        candidate.style.outline =
          candidate.dataset.cueId === cueId
            ? '2px solid #4da3ff'
            : '1px solid rgba(255,255,255,0.35)';
      });
    }

    boxes.forEach((box) => {
      const cueId = box.dataset.cueId;
      const cue = stimulus.cues.find((c) => c.id === cueId);
      const handle = box.querySelector('.resize-handle');

      box.addEventListener('mousedown', (event) => {
        if (event.target === handle) return;
        event.preventDefault();
        setActiveCue(cueId);

        const containerRect = container.getBoundingClientRect();
        const boxRect = box.getBoundingClientRect();
        const startX = event.clientX;
        const startY = event.clientY;
        const startLeftPx = boxRect.left - containerRect.left;
        const startTopPx = boxRect.top - containerRect.top;
        const boxWidthPx = boxRect.width;
        const boxHeightPx = boxRect.height;

        function onMove(moveEvent) {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;
          const newLeftPx = clamp(startLeftPx + dx, 0, container.clientWidth - boxWidthPx);
          const newTopPx = clamp(startTopPx + dy, 0, container.clientHeight - boxHeightPx);
          cue.overlay.left = pct((newLeftPx / container.clientWidth) * 100);
          cue.overlay.top = pct((newTopPx / container.clientHeight) * 100);
          box.style.left = cue.overlay.left;
          box.style.top = cue.overlay.top;
          output.value = currentStimulusOverlayCode();
        }

        function onUp() {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });

      handle.addEventListener('mousedown', (event) => {
        event.preventDefault();
        event.stopPropagation();
        setActiveCue(cueId);

        const boxRect = box.getBoundingClientRect();
        const startX = event.clientX;
        const startY = event.clientY;
        const startWidthPx = boxRect.width;
        const startHeightPx = boxRect.height;
        const startLeftPx = box.offsetLeft;
        const startTopPx = box.offsetTop;

        function onMove(moveEvent) {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;
          const maxWidth = container.clientWidth - startLeftPx;
          const maxHeight = container.clientHeight - startTopPx;
          const newWidthPx = clamp(startWidthPx + dx, 4, maxWidth);
          const newHeightPx = clamp(startHeightPx + dy, 4, maxHeight);
          cue.overlay.width = pct((newWidthPx / container.clientWidth) * 100);
          cue.overlay.height = pct((newHeightPx / container.clientHeight) * 100);
          box.style.width = cue.overlay.width;
          box.style.height = cue.overlay.height;
          output.value = currentStimulusOverlayCode();
        }

        function onUp() {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    });
  }

  rerender();
}

function buildCueSearchTimeline(stimulus) {
  const revealedCueIds = [];
  const revealOrder = [];
  const revealConfidence = [];
  let finalDecisionConfidence =
    revealConfidence.length > 0 ? Number(revealConfidence[revealConfidence.length - 1]) : 0;
  let finalDecisionRationale = '';

  function createOverlayTrial() {
    return {
      type: jsPsychHtmlButtonResponse,
      choices: [],
      stimulus: function () {
        const remainingCues = stimulus.cues.filter((c) => !revealedCueIds.includes(c.id));
        const mustAdjustConfidence = revealedCueIds.length > 0;
        const currentConfidence =
          revealConfidence.length > 0 ? Number(revealConfidence[revealConfidence.length - 1]) : 0;

        let html = `
          <div class="screen-wrap">
            <h3>${stimulus.role_prompt}</h3>
            <div class="screenshot-container" id="participant-screenshot-container">
              <img src="${stimulus.screenshot}" alt="League screenshot" />
        `;

        remainingCues.forEach((cue) => {
          const overlay = cue.overlay;
          html += `
            <button
              class="cue-overlay reveal-box"
              data-cue-id="${cue.id}"
              style="
                top:${overlay.top};
                left:${overlay.left};
                width:${overlay.width};
                height:${overlay.height};
                cursor:pointer;
              "
              aria-label="${cue.label}"
            ></button>
          `;
        });

        html += `</div>`;

        html += `
          <div class="decision-panel">
            <label for="confidence-slider" style="display:block; margin-bottom:10px; font-size:32px;">Confidence</label>
            <div class="slider-row" style="max-width:900px; margin:0 auto; gap:18px;">
              <div style="text-align:center; min-width:110px;">
                <div style="font-size:12px;">100%</div>
                <div style="font-size:14px;">Don't Fight</div>
              </div>

              <input
                id="confidence-slider"
                type="range"
                min="-100"
                max="100"
                value="${currentConfidence}"
                style="flex:1; height:32px;"
              />

              <div style="text-align:center; min-width:110px;">
                <div style="font-size:12px;">100%</div>
                <div style="font-size:14px;">Fight</div>
              </div>
            </div>

            <div style="text-align:center; font-size:13px; margin-top:8px;">
              Center = 0 (uncertain)
            </div>

            ${mustAdjustConfidence
            ? '<p class="warning-text" id="adjust-note">Move the slider before your next reveal or final decision.</p>'
            : '<p class="hint">Reveal a cue or make your final decision.</p>'
          }

            <div style="margin-top:18px;">
              <button id="finalize-btn" class="jspsych-btn">Make final decision</button>
            </div>
          </div>
        `;

        html += `</div>`;
        return html;
      },
      data: {
        stimulus_id: stimulus.id,
        phase: 'overlay'
      },
      on_load: function () {
        const slider = document.getElementById('confidence-slider');
        const finalizeBtn = document.getElementById('finalize-btn');
        const overlayButtons = document.querySelectorAll('.reveal-box');
        const mustAdjustConfidence = revealedCueIds.length > 0;
        let sliderTouched = !mustAdjustConfidence;
        const initialValue = slider ? slider.value : null;

        if (mustAdjustConfidence && slider) {
          slider.addEventListener('input', () => {
            if (slider.value !== initialValue) {
              sliderTouched = true;
              const note = document.getElementById('adjust-note');
              if (note) note.textContent = 'Confidence updated. You can continue.';
            }
          });
        }

        overlayButtons.forEach((button) => {
          button.addEventListener('click', function () {
            if (!sliderTouched) {
              alert('Move the confidence slider before continuing.');
              return;
            }
            const cueId = this.dataset.cueId;
            const now = performance.now() - experimentStart;
            const revealedCueIdsForClick = cuesTriggeredByClick(stimulus, cueId);

            jsPsych.finishTrial({
              stimulus_id: stimulus.id,
              event_type: 'reveal',
              cue_id: cueId,
              reveal_group: cueRevealGroup(stimulus.cues.find((cue) => cue.id === cueId)),
              revealed_cue_ids: revealedCueIdsForClick,
              confidence: slider ? slider.value : null,
              time: now
            });
          });
        });

        finalizeBtn.addEventListener('click', function () {
          if (!sliderTouched) {
            alert('Move the confidence slider before continuing.');
            return;
          }
          const now = performance.now() - experimentStart;
          jsPsych.finishTrial({
            stimulus_id: stimulus.id,
            event_type: 'finalize',
            confidence: slider ? slider.value : null,
            time: now
          });
        });
      }
    };
  }

  function createDecisionTrial() {
    return {
      type: jsPsychHtmlButtonResponse,
      choices: ['FIGHT', "DON'T FIGHT"],
      stimulus: function () {
        const currentConfidence =
          revealConfidence.length > 0 ? Number(revealConfidence[revealConfidence.length - 1]) : 0;
        finalDecisionConfidence = currentConfidence;
        let html = buildImageWithRemovedCues(stimulus, revealedCueIds);

        html += `
          <div class="decision-panel">
            <label for="final-confidence" style="display:block; margin-bottom:10px; font-size:32px;">Confidence</label>

            <div class="slider-row" style="max-width:900px; margin:0 auto; gap:18px;">
              <div style="text-align:center; min-width:110px;">
                <div style="font-size:12px;">100%</div>
                <div style="font-size:14px;">Don't Fight</div>
              </div>

              <input
                id="final-confidence"
                type="range"
                min="-100"
                max="100"
                value="${finalDecisionConfidence}"
                style="flex:1; height:32px;"
              />

              <div style="text-align:center; min-width:110px;">
                <div style="font-size:12px;">100%</div>
                <div style="font-size:14px;">Fight</div>
              </div>
            </div>

            <div style="text-align:center; font-size:13px; margin-top:8px;">
              Center = 0 (uncertain)
            </div>

            <div style="margin-top:20px;">
              <label for="rationale">Rationale (20-50 words)</label><br />
              <textarea id="rationale" rows="4" cols="70" placeholder="Explain your call here."></textarea>
            </div>
          </div>
        `;

        return html;
      },
      data: {
        stimulus_id: stimulus.id,
        event_type: 'decision'
      },
      on_load: function () {
        const finalConfidenceInput = document.getElementById('final-confidence');
        const rationaleInput = document.getElementById('rationale');

        if (finalConfidenceInput) {
          finalDecisionConfidence = finalConfidenceInput.value;
          finalConfidenceInput.addEventListener('input', () => {
            finalDecisionConfidence = finalConfidenceInput.value;
          });
        }

        if (rationaleInput) {
          finalDecisionRationale = rationaleInput.value;
          rationaleInput.addEventListener('input', () => {
            finalDecisionRationale = rationaleInput.value;
          });
        }
      },
      on_finish: function (data) {
        data.decision = data.response === 0 ? 'FIGHT' : "DON'T FIGHT";
        data.confidence = finalDecisionConfidence;
        data.rationale = finalDecisionRationale;
        data.reveal_order = JSON.stringify(revealOrder);
        data.cues_revealed = JSON.stringify(revealedCueIds);
        data.reveal_confidence = JSON.stringify(revealConfidence);
        data.num_cues_revealed = revealedCueIds.length;
        data.time = performance.now() - experimentStart;
      }
    };
  };

  const overlayLoop = {
    timeline: [createOverlayTrial()],
    loop_function: function (data) {
      const last = data.values()[data.values().length - 1];

      if (last.event_type === 'reveal') {
        uniquePushAll(revealedCueIds, last.revealed_cue_ids || [last.cue_id]);
        revealOrder.push({
          cue_id: last.cue_id,
          reveal_group: last.reveal_group || null,
          revealed_cue_ids: last.revealed_cue_ids || [last.cue_id],
          time: last.time
        });
        revealConfidence.push(last.confidence);
        return true;
      }

      if (last.event_type === 'finalize') {
        revealConfidence.push(last.confidence);
        return false;
      }

      return false;
    }
  };

  return [overlayLoop, createDecisionTrial()];
}

const confidenceInstructionsTrial = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Continue'],
  stimulus:
    '<div class="screen-wrap"><h2>Confidence Slider Instructions</h2>' +
    '<p>The slider measures both direction and certainty.</p>' +
    '<p><strong>-100</strong> means you are completely certain the correct call is <strong>Don\'t Fight</strong>.</p>' +
    '<p><strong>0</strong> means you are uncertain.</p>' +
    '<p><strong>100</strong> means you are completely certain the correct call is <strong>Fight</strong>.</p>' +
    '<p>After every reveal, you must move the slider before revealing another cue or making your final decision.</p></div>'
};

const surveyTrial = {
  type: jsPsychSurveyText,
  preamble: '<div class="screen-wrap"><h2>Pre-experiment Survey</h2><p>Please answer the following questions before beginning the task.</p></div>',
  questions: [
    { prompt: 'What is the highest League of Legends rank you have achieved?', name: 'rank', placeholder: 'e.g., Gold IV', required: true },
    { prompt: 'What is your current rank in League of Legends?', name: 'current_rank', placeholder: 'e.g., Platinum II', required: true },
    { prompt: 'OP.GG Link (optional)', name: 'opgg', placeholder: 'https://www.op.gg/summoner/userName=yourname' },
    { prompt: 'On average, how many hours per week do you play League of Legends?', name: 'hours', placeholder: 'e.g., 10', required: true },
    { prompt: 'Briefly describe your preferred playstyle.', name: 'playstyle', rows: 3, columns: 50, placeholder: 'Type your answer here...' },
    { prompt: 'What is your primary role in League of Legends?', name: 'role', placeholder: 'e.g., Mid, Jungle, Support', required: true },
    { prompt: 'Are you an OTP (one-trick pony) for a specific champion? If so, who?', name: 'otp', placeholder: 'e.g., Yes, I main Yasuo' },
    { prompt: 'Do you have experience playing amateur (or higher) competitive League of Legends?', name: 'competitive', placeholder: 'e.g., Yes, I played on a team for Titan eSports' }
  ],
  button_label: 'Continue'
};

const experimentInstructionsTrial = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Begin'],
  stimulus:
    '<div class="screen-wrap"><h2>Experiment Instructions</h2>' +
    '<p>Each trial shows a game screenshot with some cues hidden by black boxes.</p>' +
    '<p>Click a box to reveal that cue. After every reveal, you must update the confidence slider before revealing another cue or making your final decision.</p>' +
    '<p>When you are ready, click <strong>Make final decision</strong>.</p></div>'
};

const completionTrial = {
  type: jsPsychHtmlButtonResponse,
  choices: ['Finish and save'],
  stimulus:
    '<div class="screen-wrap">' +
    '<h2>Done</h2>' +
    '<p>You have completed the study.</p>' +
    '<p>Click the button below to save your responses and finish.</p>' +
    '</div>',
  on_finish: function () {
    const resultCsv = buildCsvResult();

    if (typeof jatos !== 'undefined') {
      jatos.endStudy(resultCsv);
    } else {
      downloadTextFile('league-study-results.csv', resultCsv);
    }
  }
};

function runParticipantExperiment() {
  const timeline = [];
  timeline.push(confidenceInstructionsTrial);
  timeline.push(surveyTrial);
  timeline.push(experimentInstructionsTrial);

  stimuli.forEach((stimulus) => {
    timeline.push(...buildCueSearchTimeline(stimulus));
  });

  timeline.push(completionTrial);

  if (typeof jatos !== 'undefined') {
    jatos.onLoad(() => {
      jsPsych.run(timeline);
    });
  } else {
    jsPsych.run(timeline);
  }
}

if (EDIT_MODE) {
  renderCalibrationApp();
} else {
  runParticipantExperiment();
}
