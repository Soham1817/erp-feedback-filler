(function () {
  const TEXT_TEMPLATES = {
    "Excellent": {
      teacherStrength:
        "The professor demonstrates exceptional subject knowledge, explains complex concepts with great clarity, encourages classroom discussions, and maintains a highly structured and engaging approach throughout the semester.",
      teacherWeakness:
        "No major weaknesses observed during the course; however, providing a few more practical examples and solved tutorial problems in class would be helpful for revision.",
      courseStrength:
        "The course curriculum is very well-structured, comprehensive, and covers fundamental concepts thoroughly while maintaining an ideal balance between theoretical foundations and practical engineering applications.",
      courseWeakness:
        "No significant weaknesses in the syllabus structure, though including more contemporary case studies and supplementary reading references could further enrich the overall learning experience.",
      suggestions:
        "Overall it was an excellent learning experience. Sharing lecture slides and tutorial solutions slightly earlier before examinations would help students prepare even more effectively."
    },
    "Very good": {
      teacherStrength:
        "The professor has strong command over the subject matter, presents topics systematically, addresses student doubts patiently, and keeps the lectures informative and well-organized throughout.",
      teacherWeakness:
        "The teaching delivery is quite solid overall, though incorporating more interactive problem-solving sessions during regular lecture hours could improve student engagement and retention.",
      courseStrength:
        "The syllabus is well-organized and covers the core topics effectively, offering a good mix of conceptual theory and analytical problem-solving relevant to the discipline.",
      courseWeakness:
        "A few modules feel slightly dense toward the end of the semester, so redistributing the lecture hours across topics would make the pacing smoother.",
      suggestions:
        "Providing additional practice problem sets with detailed solutions before the mid-semester and end-semester exams would greatly assist students in mastering the analytical portions."
    },
    "Good": {
      teacherStrength:
        "The instructor covers the prescribed syllabus systematically, explains the foundational concepts adequately, and stays approachable whenever students have queries regarding lectures or evaluation.",
      teacherWeakness:
        "Lectures can occasionally feel monotonous, and spending more time working through numerical or practical examples on the board would make complex topics easier to grasp.",
      courseStrength:
        "The course structure includes important foundational topics that are useful for the curriculum and provides a decent overview of the primary subject area.",
      courseWeakness:
        "Some parts of the course content feel slightly dated and could benefit from better alignment with modern practical applications and updated reference textbooks.",
      suggestions:
        "More structured tutorial sessions and timely feedback on graded assignments and class tests would help students track their progress and improve their understanding."
    },
    "Fair": {
      teacherStrength:
        "The instructor ensures that the scheduled lectures are conducted regularly and makes an effort to cover the topics listed in the academic syllabus.",
      teacherWeakness:
        "Clarity of explanation and classroom presentation need improvement, as complex derivations and concepts are often glossed over without sufficient intuitive examples or student interaction.",
      courseStrength:
        "The core subject matter is relevant to the degree program and introduces necessary theoretical concepts that are foundational for higher-level departmental courses.",
      courseWeakness:
        "The organization of course modules lacks smooth transitions, and there is a noticeable gap between the material covered in lectures and the questions asked in exams.",
      suggestions:
        "Improving the clarity of lecture slides, slowing down during difficult modules, and providing clear grading rubrics and solutions for assignments would significantly help students."
    },
    "Poor": {
      teacherStrength:
        "The professor conducts classes according to the timetable and provides basic reference materials and syllabus outlines at the beginning of the academic semester.",
      teacherWeakness:
        "The lectures lack clarity and structure, making it very difficult to follow the core concepts, and student doubts are rarely addressed effectively during class hours.",
      courseStrength:
        "The subject itself is an important part of the curriculum, and the textbook references listed in the syllabus are useful for independent self-study.",
      courseWeakness:
        "The course execution and structure are poorly organized, with disjointed lecture coverage and inadequate alignment between classroom teaching, tutorials, and examination questions.",
      suggestions:
        "The teaching methodology needs significant restructuring, with clearer explanations, well-organized lecture notes, regular interactive tutorials, and transparent, timely evaluation of student performance."
    }
  };

  function fillFeedbackForm(ratingVal, paceVal, workloadVal) {
    const rows = document.querySelectorAll("table tr");

    rows.forEach((row) => {
      const radios = row.querySelectorAll('input[type="radio"]');
      if (radios.length === 0) return;

      const rowLabels = Array.from(radios).map((r) =>
        (r.nextSibling?.textContent || r.parentElement?.innerText || "").trim()
      );

      const isRatingRow = rowLabels.includes("Excellent") && rowLabels.includes("Poor");
      const isPaceRow = rowLabels.includes("Just Right") || rowLabels.includes("Too Fast");
      const isWorkloadRow = rowLabels.includes("Very Heavy") || rowLabels.includes("Average");

      radios.forEach((radio) => {
        const labelText = (
          radio.nextSibling?.textContent ||
          radio.parentElement?.innerText ||
          ""
        ).trim();

        if (isRatingRow && labelText.toLowerCase() === ratingVal.toLowerCase()) {
          radio.click();
        } else if (isPaceRow && labelText.toLowerCase() === paceVal.toLowerCase()) {
          radio.click();
        } else if (isWorkloadRow && labelText.toLowerCase() === workloadVal.toLowerCase()) {
          radio.click();
        }
      });
    });

    const template = TEXT_TEMPLATES[ratingVal] || TEXT_TEMPLATES["Excellent"];
    const textareas = document.querySelectorAll("textarea");

    if (textareas.length >= 5) {
      const values = [
        template.teacherStrength,
        template.teacherWeakness,
        template.courseStrength,
        template.courseWeakness,
        template.suggestions
      ];

      textareas.forEach((ta, index) => {
        if (index < 5) {
          ta.value = values[index];
          ta.dispatchEvent(new Event("input", { bubbles: true }));
          ta.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    } else {
      textareas.forEach((ta) => {
        const placeholder = (ta.getAttribute("placeholder") || "").toLowerCase();
        if (placeholder.includes("strength")) {
          ta.value = template.teacherStrength;
        } else if (placeholder.includes("weakness")) {
          ta.value = template.teacherWeakness;
        } else if (placeholder.includes("suggestion")) {
          ta.value = template.suggestions;
        }
        ta.dispatchEvent(new Event("input", { bubbles: true }));
        ta.dispatchEvent(new Event("change", { bubbles: true }));
      });
    }

    const captchaInput = document.querySelector(
      'input[placeholder*="Captcha" i], input[name*="captcha" i], input[id*="captcha" i]'
    );
    if (captchaInput) {
      captchaInput.scrollIntoView({ behavior: "smooth", block: "center" });
      captchaInput.focus();
    }
  }

  function createSelect(id, options, defaultVal) {
    const select = document.createElement("select");
    select.id = id;
    select.style.cssText = `
      background: #334155;
      color: #f8fafc;
      border: 1px solid #475569;
      padding: 4px 8px;
      border-radius: 5px;
      font-size: 12px;
      cursor: pointer;
      outline: none;
    `;
    options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt;
      option.innerText = opt;
      if (opt === defaultVal) option.selected = true;
      select.appendChild(option);
    });
    return select;
  }

  function makeDraggable(panel, handle) {
    let isDragging = false, startX, startY, initialLeft, initialTop;
    handle.style.cursor = "move";

    handle.addEventListener("mousedown", (e) => {
      if (e.target.tagName === "BUTTON") return;
      isDragging = true;
      const rect = panel.getBoundingClientRect();
      panel.style.right = "auto";
      panel.style.bottom = "auto";
      panel.style.left = rect.left + "px";
      panel.style.top = rect.top + "px";
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = rect.left;
      initialTop = rect.top;
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      panel.style.left = initialLeft + (e.clientX - startX) + "px";
      panel.style.top = initialTop + (e.clientY - startY) + "px";
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }

  function initUI() {
    const isFeedbackFrame =
      document.body.innerText.includes("Knowledge of the teacher") ||
      document.querySelectorAll("textarea").length >= 3;

    if (!isFeedbackFrame || document.getElementById("erp-autofill-panel")) return;

    const panel = document.createElement("div");
    panel.id = "erp-autofill-panel";
    // Docked at TOP-RIGHT so it never blocks the Submit button at the bottom
    panel.style.cssText = `
      position: fixed;
      top: 16px;
      right: 24px;
      z-index: 999999;
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 12px;
      border-radius: 10px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.35);
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      gap: 8px;
      border: 1px solid #334155;
      min-width: 280px;
    `;

    // Draggable Header with Minimize & Close buttons
    const header = document.createElement("div");
    header.style.cssText = "display: flex; justify-content: space-between; align-items: center; gap: 10px; user-select: none;";

    const title = document.createElement("span");
    title.innerText = "⚡ ERP Autofiller (Drag)";
    title.style.cssText = "font-weight: 700; font-size: 12px; color: #38bdf8;";

    const winBtns = document.createElement("div");
    winBtns.style.cssText = "display: flex; gap: 4px;";

    const bodyContainer = document.createElement("div");
    bodyContainer.style.cssText = "display: flex; flex-direction: column; gap: 8px;";

    let minimized = false;
    const toggleMinimize = (forceState) => {
      minimized = typeof forceState === "boolean" ? forceState : !minimized;
      bodyContainer.style.display = minimized ? "none" : "flex";
      panel.style.minWidth = minimized ? "auto" : "280px";
      minBtn.innerText = minimized ? "+" : "—";
    };

    const minBtn = document.createElement("button");
    minBtn.innerText = "—";
    minBtn.title = "Minimize / Expand";
    minBtn.style.cssText = "background:#334155; color:#fff; border:none; border-radius:4px; width:22px; height:22px; cursor:pointer; font-weight:bold; font-size:12px; line-height:1;";
    minBtn.onclick = (e) => {
      e.preventDefault();
      toggleMinimize();
    };

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "✕";
    closeBtn.title = "Hide Panel";
    closeBtn.style.cssText = "background:#dc2626; color:#fff; border:none; border-radius:4px; width:22px; height:22px; cursor:pointer; font-weight:bold; font-size:11px; line-height:1;";
    closeBtn.onclick = (e) => {
      e.preventDefault();
      panel.style.display = "none";
    };

    winBtns.appendChild(minBtn);
    winBtns.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(winBtns);
    panel.appendChild(header);

    makeDraggable(panel, header);

    const quickRow = document.createElement("div");
    quickRow.style.cssText = "display: flex; gap: 4px; flex-wrap: wrap;";

    const presets = [
      { label: "Excellent", color: "#16a34a" },
      { label: "Very good", color: "#2563eb" },
      { label: "Good", color: "#0d9488" },
      { label: "Fair", color: "#d97706" },
      { label: "Poor", color: "#dc2626" }
    ];

    const ratingSelect = createSelect(
      "erp-rating-select",
      ["Excellent", "Very good", "Good", "Fair", "Poor"],
      "Excellent"
    );
    const paceSelect = createSelect(
      "erp-pace-select",
      ["Too Fast", "Fast", "Just Right", "Slow", "Too Slow"],
      "Just Right"
    );
    const workloadSelect = createSelect(
      "erp-workload-select",
      ["Very Heavy", "Heavy", "Average", "Light", "Very Light"],
      "Average"
    );

    presets.forEach((p) => {
      const btn = document.createElement("button");
      btn.innerText = p.label;
      btn.style.cssText = `
        background: ${p.color};
        color: white;
        border: none;
        padding: 5px 8px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
        font-size: 11px;
        flex: 1;
        white-space: nowrap;
      `;
      btn.onclick = (e) => {
        e.preventDefault();
        ratingSelect.value = p.label;
        fillFeedbackForm(p.label, paceSelect.value, workloadSelect.value);
        toggleMinimize(true); // Auto-minimize after filling!
      };
      quickRow.appendChild(btn);
    });
    bodyContainer.appendChild(quickRow);

    const controlsGrid = document.createElement("div");
    controlsGrid.style.cssText = "display: grid; grid-template-columns: auto 1fr; gap: 5px 8px; align-items: center; font-size: 12px; border-top: 1px solid #1e293b; padding-top: 6px;";

    const addControl = (labelText, selectEl) => {
      const lbl = document.createElement("span");
      lbl.innerText = labelText;
      lbl.style.color = "#94a3b8";
      controlsGrid.appendChild(lbl);
      controlsGrid.appendChild(selectEl);
    };

    addControl("Q1–10 Rating:", ratingSelect);
    addControl("Q4 Pace:", paceSelect);
    addControl("Q13–14 Load:", workloadSelect);
    bodyContainer.appendChild(controlsGrid);

    const applyBtn = document.createElement("button");
    applyBtn.innerText = "Apply Custom Selection";
    applyBtn.style.cssText = `
      background: #4f46e5;
      color: white;
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 12px;
      width: 100%;
    `;
    applyBtn.onclick = (e) => {
      e.preventDefault();
      fillFeedbackForm(ratingSelect.value, paceSelect.value, workloadSelect.value);
      toggleMinimize(true); // Auto-minimize after filling!
    };
    bodyContainer.appendChild(applyBtn);

    panel.appendChild(bodyContainer);
    document.body.appendChild(panel);
  }

  const observer = new MutationObserver(() => {
    initUI();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  initUI();
})();
