const TEXT_TEMPLATES = {
  "Excellent": {
    teacherStrength: "The professor demonstrates exceptional subject knowledge, explains complex concepts with great clarity, encourages classroom discussions, and maintains a highly structured and engaging approach throughout the semester.",
    teacherWeakness: "No major weaknesses observed during the course; however, providing a few more practical examples and solved tutorial problems in class would be helpful for revision.",
    courseStrength: "The course curriculum is very well-structured, comprehensive, and covers fundamental concepts thoroughly while maintaining an ideal balance between theoretical foundations and practical engineering applications.",
    courseWeakness: "No significant weaknesses in the syllabus structure, though including more contemporary case studies and supplementary reading references could further enrich the overall learning experience.",
    suggestions: "Overall it was an excellent learning experience. Sharing lecture slides and tutorial solutions slightly earlier before examinations would help students prepare even more effectively."
  },
  "Very good": {
    teacherStrength: "The professor has strong command over the subject matter, presents topics systematically, addresses student doubts patiently, and keeps the lectures informative and well-organized throughout.",
    teacherWeakness: "The teaching delivery is quite solid overall, though incorporating more interactive problem-solving sessions during regular lecture hours could improve student engagement and retention.",
    courseStrength: "The syllabus is well-organized and covers the core topics effectively, offering a good mix of conceptual theory and analytical problem-solving relevant to the discipline.",
    courseWeakness: "A few modules feel slightly dense toward the end of the semester, so redistributing the lecture hours across topics would make the pacing smoother.",
    suggestions: "Providing additional practice problem sets with detailed solutions before the mid-semester and end-semester exams would greatly assist students in mastering the analytical portions."
  },
  "Good": {
    teacherStrength: "The instructor covers the prescribed syllabus systematically, explains the foundational concepts adequately, and stays approachable whenever students have queries regarding lectures or evaluation.",
    teacherWeakness: "Lectures can occasionally feel monotonous, and spending more time working through numerical or practical examples on the board would make complex topics easier to grasp.",
    courseStrength: "The course structure includes important foundational topics that are useful for the curriculum and provides a decent overview of the primary subject area.",
    courseWeakness: "Some parts of the course content feel slightly dated and could benefit from better alignment with modern practical applications and updated reference textbooks.",
    suggestions: "More structured tutorial sessions and timely feedback on graded assignments and class tests would help students track their progress and improve their understanding."
  },
  "Fair": {
    teacherStrength: "The instructor ensures that the scheduled lectures are conducted regularly and makes an effort to cover the topics listed in the academic syllabus.",
    teacherWeakness: "Clarity of explanation and classroom presentation need improvement, as complex derivations and concepts are often glossed over without sufficient intuitive examples or student interaction.",
    courseStrength: "The core subject matter is relevant to the degree program and introduces necessary theoretical concepts that are foundational for higher-level departmental courses.",
    courseWeakness: "The organization of course modules lacks smooth transitions, and there is a noticeable gap between the material covered in lectures and the questions asked in exams.",
    suggestions: "Improving the clarity of lecture slides, slowing down during difficult modules, and providing clear grading rubrics and solutions for assignments would significantly help students."
  },
  "Poor": {
    teacherStrength: "The professor conducts classes according to the timetable and provides basic reference materials and syllabus outlines at the beginning of the academic semester.",
    teacherWeakness: "The lectures lack clarity and structure, making it very difficult to follow the core concepts, and student doubts are rarely addressed effectively during class hours.",
    courseStrength: "The subject itself is an important part of the curriculum, and the textbook references listed in the syllabus are useful for independent self-study.",
    courseWeakness: "The course execution and structure are poorly organized, with disjointed lecture coverage and inadequate alignment between classroom teaching, tutorials, and examination questions.",
    suggestions: "The teaching methodology needs significant restructuring, with clearer explanations, well-organized lecture notes, regular interactive tutorials, and transparent, timely evaluation of student performance."
  }
};

function injectedFill(ratingVal, paceVal, workloadVal, templates) {
  let filledCount = 0;
  const rows = document.querySelectorAll("table tr");

  rows.forEach((row) => {
    const radios = row.querySelectorAll('input[type="radio"]');
    if (radios.length === 0) return;

    const rowLabels = Array.from(radios).map((r) =>
      (r.nextSibling?.textContent || r.parentElement?.innerText || "").trim()
    );

    const isRatingRow = rowLabels.some(l => l.toLowerCase() === "excellent") && rowLabels.some(l => l.toLowerCase() === "poor");
    const isPaceRow = rowLabels.some(l => l.toLowerCase() === "just right") || rowLabels.some(l => l.toLowerCase() === "too fast");
    const isWorkloadRow = rowLabels.some(l => l.toLowerCase() === "very heavy") || rowLabels.some(l => l.toLowerCase() === "average");

    radios.forEach((radio) => {
      const labelText = (radio.nextSibling?.textContent || radio.parentElement?.innerText || "").trim();
      if (isRatingRow && labelText.toLowerCase() === ratingVal.toLowerCase()) {
        radio.click();
        filledCount++;
      } else if (isPaceRow && labelText.toLowerCase() === paceVal.toLowerCase()) {
        radio.click();
        filledCount++;
      } else if (isWorkloadRow && labelText.toLowerCase() === workloadVal.toLowerCase()) {
        radio.click();
        filledCount++;
      }
    });
  });

  const template = templates[ratingVal] || templates["Excellent"];
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
        filledCount++;
      }
    });
  } else if (textareas.length > 0) {
    textareas.forEach((ta) => {
      const placeholder = (ta.getAttribute("placeholder") || "").toLowerCase();
      if (placeholder.includes("strength")) ta.value = template.teacherStrength;
      else if (placeholder.includes("weakness")) ta.value = template.teacherWeakness;
      else if (placeholder.includes("suggestion")) ta.value = template.suggestions;
      ta.dispatchEvent(new Event("input", { bubbles: true }));
      ta.dispatchEvent(new Event("change", { bubbles: true }));
      filledCount++;
    });
  }

  const captchaInput = document.querySelector(
    'input[placeholder*="Captcha" i], input[name*="captcha" i], input[id*="captcha" i]'
  );
  if (captchaInput) {
    captchaInput.scrollIntoView({ behavior: "smooth", block: "center" });
    captchaInput.focus();
  }
  return filledCount;
}

async function runAutofill(ratingVal, paceVal, workloadVal) {
  const statusEl = document.getElementById("status");
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: injectedFill,
      args: [ratingVal, paceVal, workloadVal, TEXT_TEMPLATES]
    });

    const totalFilled = results.reduce((acc, r) => acc + (r.result || 0), 0);
    statusEl.innerText = totalFilled > 0 ? `✓ Filled ${totalFilled} fields!` : "⚠️ Select a subject/faculty first.";
  } catch (err) {
    statusEl.innerText = "⚠️ Open the ERP Feedback tab first.";
  }
}

document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const rating = btn.getAttribute("data-rating");
    document.getElementById("rating").value = rating;
    const pace = document.getElementById("pace").value;
    const workload = document.getElementById("workload").value;
    runAutofill(rating, pace, workload);
  });
});

document.getElementById("apply-btn").addEventListener("click", () => {
  const rating = document.getElementById("rating").value;
  const pace = document.getElementById("pace").value;
  const workload = document.getElementById("workload").value;
  runAutofill(rating, pace, workload);
});
