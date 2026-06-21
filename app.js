// Resume Builder State Management and Dynamic Engine

// 1. DEFAULT SEED DATA
const DEFAULT_STATE = {
  personal: {
    fullname: "Alexander Mercer",
    jobtitle: "Staff Full-Stack Engineer",
    email: "alexander.mercer@dev.io",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    website: "https://mercer.dev",
    linkedin: "alexmercer",
    github: "alexmercer",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200",
    summary: "Passionate Staff Engineer with 8+ years of experience specializing in building highly scalable web systems and elegant developer tools. Proven record of leading cross-functional teams, optimizing system architectures, and delivering state-of-the-art frontend applications with modern design systems.",
    showPhoto: true
  },
  experience: [
    {
      id: "exp-1",
      title: "Lead Software Engineer",
      company: "TechCorp",
      location: "San Francisco, CA",
      start: "Jan 2023",
      end: "Present",
      description: "Spearheaded migration of legacy core services to micro-frontends, improving page load speeds by 42%.\nMentored 12 junior and mid-level engineers across frontend and backend technologies.\nDesigned internal component library used by 5 product teams, reducing design-to-dev time by 30%."
    },
    {
      id: "exp-2",
      title: "Senior Full-Stack Engineer",
      company: "WebFlow Inc",
      location: "New York, NY",
      start: "Sep 2020",
      end: "Dec 2022",
      description: "Designed and built custom drag-and-drop workflow automation dashboard used by 100k+ weekly active users.\nArchitected highly resilient Node.js API layer reducing average database response latencies by 30%.\nIntegrated Stripe-based billing microservice supporting 15+ local currencies and recurring memberships."
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "M.S. in Computer Science",
      school: "Stanford University",
      location: "Stanford, CA",
      start: "Sep 2018",
      end: "Jun 2020",
      details: "Specialization in Distributed Systems. GPA: 3.9/4.0. Thesis on Decentralized State Protocols."
    },
    {
      id: "edu-2",
      degree: "B.S. in Software Engineering",
      school: "UC Berkeley",
      location: "Berkeley, CA",
      start: "Sep 2014",
      end: "May 2018",
      details: "Graduated with Honors. Co-founder of Berkeley Developers Club."
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Antigravity Engine",
      tech: "Rust, TypeScript, WebAssembly",
      date: "2025",
      link: "https://github.com/alexmercer/antigravity",
      description: "An open-source reactive state synchronization framework with 12k+ stars on GitHub. Reduces state-latency by rendering logic inside WASM."
    },
    {
      id: "proj-2",
      title: "DevSpaces Extension",
      tech: "TypeScript, Docker, Go",
      date: "2024",
      link: "https://mercer.dev/devspaces",
      description: "A lightweight cloud-based workspace extension. Bootstraps environment settings in containerized developer sandboxes. Acquired by TechCorp."
    }
  ],
  skills: [
    {
      id: "skill-1",
      category: "Languages",
      skills: "TypeScript, JavaScript, Rust, Python, Go, SQL, HTML/CSS"
    },
    {
      id: "skill-2",
      category: "Frameworks & Libraries",
      skills: "React, Next.js, Node.js, Express, FastAPI, Actix-web"
    },
    {
      id: "skill-3",
      category: "DevOps & Cloud",
      skills: "AWS, Docker, Kubernetes, CI/CD (GitHub Actions), Terraform"
    }
  ],
  design: {
    template: "modern",
    themeColor: "#2563eb",
    fontFamily: "Outfit, sans-serif",
    fontSize: "14px",
    sectionSpacing: "0.8rem",
    uppercaseHeaders: true
  }
};

let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
let zoomLevel = 1.0;

// 2. INITIALIZATION AND CORE HANDLERS
document.addEventListener("DOMContentLoaded", () => {
  loadLocalStorage();
  initFormBindings();
  renderAllDynamicLists();
  applyCustomDesignSettings();
  renderResume();
  initTabNavigation();
  initZoomHandlers();
  initActionHandlers();
});

// Load state from LocalStorage
function loadLocalStorage() {
  const savedState = localStorage.getItem("craftcv_resume_state");
  if (savedState) {
    try {
      state = JSON.parse(savedState);
      
      // Backward compatibility / safety checks for new fields
      if (!state.personal) state.personal = JSON.parse(JSON.stringify(DEFAULT_STATE.personal));
      if (!state.experience) state.experience = [];
      if (!state.education) state.education = [];
      if (!state.projects) state.projects = [];
      if (!state.skills) state.skills = [];
      if (!state.design) state.design = JSON.parse(JSON.stringify(DEFAULT_STATE.design));
    } catch (e) {
      console.error("Error parsing saved state:", e);
      state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  } else {
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}

// Save state to LocalStorage and update live preview
function saveState() {
  localStorage.setItem("craftcv_resume_state", JSON.stringify(state));
  renderResume();
}

// 3. TAB NAVIGATION CONTROL
function initTabNavigation() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const formPanels = document.querySelectorAll(".form-panel");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      
      // Toggle active states on tabs
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      // Toggle active states on form panels
      formPanels.forEach(panel => {
        if (panel.id === `panel-${tabId}`) {
          panel.classList.add("active");
        } else {
          panel.classList.remove("active");
        }
      });
    });
  });
}

// 4. FORM AND STATE INPUT BINDINGS
function initFormBindings() {
  // Bind simple Personal Info inputs
  const personalInputs = [
    { id: "input-fullname", field: "fullname" },
    { id: "input-jobtitle", field: "jobtitle" },
    { id: "input-email", field: "email" },
    { id: "input-phone", field: "phone" },
    { id: "input-location", field: "location" },
    { id: "input-website", field: "website" },
    { id: "input-linkedin", field: "linkedin" },
    { id: "input-github", field: "github" },
    { id: "input-photo", field: "photo" },
    { id: "input-summary", field: "summary" }
  ];

  personalInputs.forEach(({ id, field }) => {
    const el = document.getElementById(id);
    if (el) {
      // Set initial value
      el.value = state.personal[field] || "";
      
      // Bind input listeners
      el.addEventListener("input", (e) => {
        state.personal[field] = e.target.value;
        saveState();
      });
    }
  });

  // Bind design customization control panel
  const templateSelect = document.getElementById("select-template");
  if (templateSelect) {
    templateSelect.value = state.design.template;
    templateSelect.addEventListener("change", (e) => {
      state.design.template = e.target.value;
      saveState();
    });
  }

  // Preset Colors
  const colorPresets = document.querySelectorAll(".color-preset");
  const customColorPicker = document.getElementById("custom-color-picker");

  colorPresets.forEach(preset => {
    const col = preset.getAttribute("data-color");
    if (col === state.design.themeColor) {
      colorPresets.forEach(p => p.classList.remove("active"));
      preset.classList.add("active");
    }

    preset.addEventListener("click", () => {
      colorPresets.forEach(p => p.classList.remove("active"));
      preset.classList.add("active");
      state.design.themeColor = col;
      if (customColorPicker) customColorPicker.value = col;
      saveState();
    });
  });

  if (customColorPicker) {
    customColorPicker.value = state.design.themeColor;
    customColorPicker.addEventListener("input", (e) => {
      colorPresets.forEach(p => p.classList.remove("active"));
      state.design.themeColor = e.target.value;
      saveState();
    });
  }

  // Typography Settings
  const fontSelect = document.getElementById("select-font");
  if (fontSelect) {
    fontSelect.value = state.design.fontFamily;
    fontSelect.addEventListener("change", (e) => {
      state.design.fontFamily = e.target.value;
      saveState();
    });
  }

  const fontSizeSelect = document.getElementById("select-fontsize");
  if (fontSizeSelect) {
    fontSizeSelect.value = state.design.fontSize;
    fontSizeSelect.addEventListener("change", (e) => {
      state.design.fontSize = e.target.value;
      saveState();
    });
  }

  // Spacing Range Input
  const spacingRange = document.getElementById("range-spacing");
  const spacingValueSpan = document.getElementById("spacing-value");
  if (spacingRange) {
    spacingRange.value = parseFloat(state.design.sectionSpacing);
    updateSpacingText(state.design.sectionSpacing, spacingValueSpan);
    
    spacingRange.addEventListener("input", (e) => {
      const val = e.target.value;
      state.design.sectionSpacing = `${val}rem`;
      updateSpacingText(`${val}rem`, spacingValueSpan);
      saveState();
    });
  }

  // Layout preference Checkboxes
  const checkShowPhoto = document.getElementById("check-show-photo");
  if (checkShowPhoto) {
    checkShowPhoto.checked = state.personal.showPhoto !== false;
    checkShowPhoto.addEventListener("change", (e) => {
      state.personal.showPhoto = e.target.checked;
      saveState();
    });
  }

  const checkUppercase = document.getElementById("check-uppercase-headers");
  if (checkUppercase) {
    checkUppercase.checked = state.design.uppercaseHeaders !== false;
    checkUppercase.addEventListener("change", (e) => {
      state.design.uppercaseHeaders = e.target.checked;
      saveState();
    });
  }
}

function updateSpacingText(val, span) {
  if (!span) return;
  const num = parseFloat(val);
  if (num < 0.6) span.textContent = "Compact";
  else if (num <= 0.9) span.textContent = "Normal";
  else if (num <= 1.2) span.textContent = "Relaxed";
  else span.textContent = "Spacious";
}

// Apply design settings to preview element styles (CSS Variables)
function applyCustomDesignSettings() {
  const doc = document.getElementById("resume-document");
  if (!doc) return;

  doc.style.setProperty("--resume-theme-color", state.design.themeColor);
  doc.style.setProperty("--resume-font-family", state.design.fontFamily);
  doc.style.setProperty("--resume-font-size", state.design.fontSize);
  doc.style.setProperty("--resume-section-spacing", state.design.sectionSpacing);
  doc.style.setProperty("--header-transform", state.design.uppercaseHeaders ? "uppercase" : "none");
}

// 5. DYNAMIC LIST EDITOR RENDERING
function renderAllDynamicLists() {
  renderExperienceList();
  renderEducationList();
  renderProjectsList();
  renderSkillsList();
}

// Dynamic List: Work Experience
function renderExperienceList() {
  const list = document.getElementById("experience-list");
  if (!list) return;
  list.innerHTML = "";

  state.experience.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "list-item-card";
    card.innerHTML = `
      <div class="card-header-actions">
        <span class="card-title">Role #${index + 1}: ${item.title || "Untitled Role"}</span>
        <button class="delete-item-btn" data-id="${item.id}" title="Remove Role">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label>Job Title</label>
          <input type="text" class="exp-input" data-id="${item.id}" data-field="title" value="${item.title || ""}" placeholder="Senior Web Developer">
        </div>
        <div class="form-group">
          <label>Company / Employer</label>
          <input type="text" class="exp-input" data-id="${item.id}" data-field="company" value="${item.company || ""}" placeholder="Google">
        </div>
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label>Location</label>
          <input type="text" class="exp-input" data-id="${item.id}" data-field="location" value="${item.location || ""}" placeholder="New York, NY">
        </div>
        <div class="form-group">
          <label>Timeline (Dates)</label>
          <input type="text" class="exp-input" data-id="${item.id}" data-field="start" value="${item.start || ""}" placeholder="Jan 2022 - Present">
        </div>
      </div>
      <div class="form-group">
        <label>Description / Core Achievements (One per line)</label>
        <textarea rows="4" class="exp-input" data-id="${item.id}" data-field="description" placeholder="Led a team of 4 devs...\nArchitected core APIs...">${item.description || ""}</textarea>
      </div>
    `;
    list.appendChild(card);
  });

  // Bind input listeners
  list.querySelectorAll(".exp-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const id = e.target.getAttribute("data-id");
      const field = e.target.getAttribute("data-field");
      const idx = state.experience.findIndex(item => item.id === id);
      if (idx !== -1) {
        state.experience[idx][field] = e.target.value;
        saveState();
        
        // Update card title
        if (field === "title") {
          const titleSpan = e.target.closest(".list-item-card").querySelector(".card-title");
          if (titleSpan) titleSpan.textContent = `Role #${idx + 1}: ${e.target.value || "Untitled Role"}`;
        }
      }
    });
  });

  // Delete handler
  list.querySelectorAll(".delete-item-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      state.experience = state.experience.filter(item => item.id !== id);
      saveState();
      renderExperienceList();
    });
  });
}

// Dynamic List: Education
function renderEducationList() {
  const list = document.getElementById("education-list");
  if (!list) return;
  list.innerHTML = "";

  state.education.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "list-item-card";
    card.innerHTML = `
      <div class="card-header-actions">
        <span class="card-title">Degree #${index + 1}: ${item.degree || "Untitled Study"}</span>
        <button class="delete-item-btn" data-id="${item.id}" title="Remove Degree">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label>Degree / Certificate</label>
          <input type="text" class="edu-input" data-id="${item.id}" data-field="degree" value="${item.degree || ""}" placeholder="B.S. in Computer Science">
        </div>
        <div class="form-group">
          <label>School / University</label>
          <input type="text" class="edu-input" data-id="${item.id}" data-field="school" value="${item.school || ""}" placeholder="MIT">
        </div>
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label>Location</label>
          <input type="text" class="edu-input" data-id="${item.id}" data-field="location" value="${item.location || ""}" placeholder="Cambridge, MA">
        </div>
        <div class="form-group">
          <label>Timeline (Dates)</label>
          <input type="text" class="edu-input" data-id="${item.id}" data-field="start" value="${item.start || ""}" placeholder="2016 - 2020">
        </div>
      </div>
      <div class="form-group">
        <label>Extra Details / GPA / Honors</label>
        <textarea rows="2" class="edu-input" data-id="${item.id}" data-field="details" placeholder="Graduated Summa Cum Laude. GPA: 3.9/4.0.">${item.details || ""}</textarea>
      </div>
    `;
    list.appendChild(card);
  });

  // Bind input listeners
  list.querySelectorAll(".edu-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const id = e.target.getAttribute("data-id");
      const field = e.target.getAttribute("data-field");
      const idx = state.education.findIndex(item => item.id === id);
      if (idx !== -1) {
        state.education[idx][field] = e.target.value;
        saveState();

        if (field === "degree") {
          const titleSpan = e.target.closest(".list-item-card").querySelector(".card-title");
          if (titleSpan) titleSpan.textContent = `Degree #${idx + 1}: ${e.target.value || "Untitled Study"}`;
        }
      }
    });
  });

  list.querySelectorAll(".delete-item-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      state.education = state.education.filter(item => item.id !== id);
      saveState();
      renderEducationList();
    });
  });
}

// Dynamic List: Projects
function renderProjectsList() {
  const list = document.getElementById("project-list");
  if (!list) return;
  list.innerHTML = "";

  state.projects.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "list-item-card";
    card.innerHTML = `
      <div class="card-header-actions">
        <span class="card-title">Project #${index + 1}: ${item.title || "Untitled Project"}</span>
        <button class="delete-item-btn" data-id="${item.id}" title="Remove Project">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label>Project Title</label>
          <input type="text" class="proj-input" data-id="${item.id}" data-field="title" value="${item.title || ""}" placeholder="Portfolio Website">
        </div>
        <div class="form-group">
          <label>Technologies Used</label>
          <input type="text" class="proj-input" data-id="${item.id}" data-field="tech" value="${item.tech || ""}" placeholder="React, Node.js, CSS3">
        </div>
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label>Project Link / URL</label>
          <input type="url" class="proj-input" data-id="${item.id}" data-field="link" value="${item.link || ""}" placeholder="https://myproject.com">
        </div>
        <div class="form-group">
          <label>Timeline / Date</label>
          <input type="text" class="proj-input" data-id="${item.id}" data-field="date" value="${item.date || ""}" placeholder="Summer 2024">
        </div>
      </div>
      <div class="form-group">
        <label>Description / Key Deliverables</label>
        <textarea rows="3" class="proj-input" data-id="${item.id}" data-field="description" placeholder="Built a responsive portfolio to showcase web experiences. Optimized SEO details.">${item.description || ""}</textarea>
      </div>
    `;
    list.appendChild(card);
  });

  list.querySelectorAll(".proj-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const id = e.target.getAttribute("data-id");
      const field = e.target.getAttribute("data-field");
      const idx = state.projects.findIndex(item => item.id === id);
      if (idx !== -1) {
        state.projects[idx][field] = e.target.value;
        saveState();

        if (field === "title") {
          const titleSpan = e.target.closest(".list-item-card").querySelector(".card-title");
          if (titleSpan) titleSpan.textContent = `Project #${idx + 1}: ${e.target.value || "Untitled Project"}`;
        }
      }
    });
  });

  list.querySelectorAll(".delete-item-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      state.projects = state.projects.filter(item => item.id !== id);
      saveState();
      renderProjectsList();
    });
  });
}

// Dynamic List: Skills Categories
function renderSkillsList() {
  const list = document.getElementById("skill-list");
  if (!list) return;
  list.innerHTML = "";

  state.skills.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "list-item-card";
    card.innerHTML = `
      <div class="card-header-actions">
        <span class="card-title">Category #${index + 1}: ${item.category || "Untitled Category"}</span>
        <button class="delete-item-btn" data-id="${item.id}" title="Remove Category">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
      <div class="form-group">
        <label>Skill Category Name</label>
        <input type="text" class="skill-input" data-id="${item.id}" data-field="category" value="${item.category || ""}" placeholder="Frontend Development">
      </div>
      <div class="form-group">
        <label>Skills (Comma-separated)</label>
        <input type="text" class="skill-input" data-id="${item.id}" data-field="skills" value="${item.skills || ""}" placeholder="HTML5, CSS3, ES6 JavaScript, Webpack">
      </div>
    `;
    list.appendChild(card);
  });

  list.querySelectorAll(".skill-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const id = e.target.getAttribute("data-id");
      const field = e.target.getAttribute("data-field");
      const idx = state.skills.findIndex(item => item.id === id);
      if (idx !== -1) {
        state.skills[idx][field] = e.target.value;
        saveState();

        if (field === "category") {
          const titleSpan = e.target.closest(".list-item-card").querySelector(".card-title");
          if (titleSpan) titleSpan.textContent = `Category #${idx + 1}: ${e.target.value || "Untitled Category"}`;
        }
      }
    });
  });

  list.querySelectorAll(".delete-item-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      state.skills = state.skills.filter(item => item.id !== id);
      saveState();
      renderSkillsList();
    });
  });
}

// Add Item Button Handlers
function initActionHandlers() {
  // Add work experience
  const addExpBtn = document.getElementById("add-experience");
  if (addExpBtn) {
    addExpBtn.addEventListener("click", () => {
      state.experience.push({
        id: `exp-${Date.now()}`,
        title: "",
        company: "",
        location: "",
        start: "",
        end: "",
        description: ""
      });
      saveState();
      renderExperienceList();
    });
  }

  // Add education degree
  const addEduBtn = document.getElementById("add-education");
  if (addEduBtn) {
    addEduBtn.addEventListener("click", () => {
      state.education.push({
        id: `edu-${Date.now()}`,
        degree: "",
        school: "",
        location: "",
        start: "",
        end: "",
        details: ""
      });
      saveState();
      renderEducationList();
    });
  }

  // Add project
  const addProjBtn = document.getElementById("add-project");
  if (addProjBtn) {
    addProjBtn.addEventListener("click", () => {
      state.projects.push({
        id: `proj-${Date.now()}`,
        title: "",
        tech: "",
        date: "",
        link: "",
        description: ""
      });
      saveState();
      renderProjectsList();
    });
  }

  // Add skills group
  const addSkillBtn = document.getElementById("add-skill-group");
  if (addSkillBtn) {
    addSkillBtn.addEventListener("click", () => {
      state.skills.push({
        id: `skill-${Date.now()}`,
        category: "",
        skills: ""
      });
      saveState();
      renderSkillsList();
    });
  }

  // Global resets and actions
  const resetBtn = document.getElementById("reset-data");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all fields? This will delete your current draft.")) {
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        localStorage.setItem("craftcv_resume_state", JSON.stringify(state));
        
        // Reload dashboard
        initFormBindings();
        renderAllDynamicLists();
        applyCustomDesignSettings();
        renderResume();
        
        // Set tab back to personal
        const tabBtn = document.querySelector(".tab-btn[data-tab='personal']");
        if (tabBtn) tabBtn.click();
      }
    });
  }

  // Export JSON
  const exportBtn = document.getElementById("export-json");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      const name = state.personal.fullname ? state.personal.fullname.replace(/\s+/g, '-').toLowerCase() : "craftcv";
      downloadAnchor.setAttribute("download", `${name}-resume.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  // Import JSON File Reader
  const importInput = document.getElementById("import-json");
  if (importInput) {
    importInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const imported = JSON.parse(evt.target.result);
          if (imported.personal && imported.design) {
            state = imported;
            localStorage.setItem("craftcv_resume_state", JSON.stringify(state));
            
            // Reload all bindings and layout
            initFormBindings();
            renderAllDynamicLists();
            applyCustomDesignSettings();
            renderResume();
            alert("Resume settings loaded successfully!");
          } else {
            alert("Invalid JSON format. Make sure it was exported from CraftCV.");
          }
        } catch (err) {
          alert("Error reading JSON file.");
          console.error(err);
        }
      };
      reader.readAsText(file);
    });
  }

  // PDF Print Trigger
  const printBtn = document.getElementById("print-pdf");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
}

// 6. ZOOM SCALE CONTROL
function initZoomHandlers() {
  const zoomFactor = document.getElementById("zoom-factor");
  const resumePaper = document.getElementById("resume-document");
  
  function applyZoom() {
    if (resumePaper && zoomFactor) {
      resumePaper.style.transform = `scale(${zoomLevel})`;
      zoomFactor.textContent = `${Math.round(zoomLevel * 100)}%`;
      
      // Offset bottom margin to counter transformation overlaps
      const height = resumePaper.getBoundingClientRect().height;
      const originalHeight = 297 * 3.7795; // mm to px approx
      const diff = (height - originalHeight);
      
      // Add extra margin bottom if scaled up
      if (zoomLevel > 1.0) {
        resumePaper.style.marginBottom = `${diff + 40}px`;
      } else {
        resumePaper.style.marginBottom = "40px";
      }
    }
  }

  const zoomInBtn = document.getElementById("zoom-in");
  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => {
      if (zoomLevel < 1.5) {
        zoomLevel += 0.1;
        applyZoom();
      }
    });
  }

  const zoomOutBtn = document.getElementById("zoom-out");
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => {
      if (zoomLevel > 0.6) {
        zoomLevel -= 0.1;
        applyZoom();
      }
    });
  }

  // Double click zoom reset
  if (zoomFactor) {
    zoomFactor.style.cursor = "pointer";
    zoomFactor.addEventListener("click", () => {
      zoomLevel = 1.0;
      applyZoom();
    });
  }
}

// 7. THEME RENDER ENGINE (DYNAMIC PREVIEW UPDATER)
function renderResume() {
  applyCustomDesignSettings();
  const doc = document.getElementById("resume-document");
  if (!doc) return;

  // Clear document classes and inject template specificity
  doc.className = `resume-paper template-${state.design.template}`;
  
  // Destructure personal fields
  const { fullname, jobtitle, email, phone, location, website, github, linkedin, photo, summary, showPhoto } = state.personal;
  
  // Format description bullet points
  const formatBulletPoints = (text) => {
    if (!text) return "";
    const lines = text.split("\n").filter(line => line.trim() !== "");
    if (lines.length === 0) return "";
    return `<ul>${lines.map(line => `<li>${line.trim()}</li>`).join("")}</ul>`;
  };

  // Pre-process common sections
  const contactHTML = `
    <div class="resume-contacts">
      ${email ? `
        <div class="contact-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <a href="mailto:${email}">${email}</a>
        </div>
      ` : ""}
      
      ${phone ? `
        <div class="contact-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>${phone}</span>
        </div>
      ` : ""}

      ${location ? `
        <div class="contact-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>${location}</span>
        </div>
      ` : ""}

      ${website ? `
        <div class="contact-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <a href="${website}" target="_blank">${website.replace(/^https?:\/\//, '')}</a>
        </div>
      ` : ""}

      ${linkedin ? `
        <div class="contact-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          <a href="https://linkedin.com/in/${linkedin}" target="_blank">in/${linkedin}</a>
        </div>
      ` : ""}

      ${github ? `
        <div class="contact-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          <a href="https://github.com/${github}" target="_blank">github/${github}</a>
        </div>
      ` : ""}
    </div>
  `;

  const summaryHTML = summary ? `
    <div class="resume-section">
      <div class="resume-section-title">Professional Summary</div>
      <p class="resume-item-desc">${summary}</p>
    </div>
  ` : "";

  const experienceHTML = state.experience.length > 0 ? `
    <div class="resume-section">
      <div class="resume-section-title">Work Experience</div>
      ${state.experience.map(item => `
        <div class="resume-item">
          <div class="resume-item-header">
            <span class="resume-item-title">${item.title || "Untitled Role"}</span>
            <span class="resume-item-date">${item.start || ""} ${item.end ? ` — ${item.end}` : ""}</span>
          </div>
          <div class="resume-item-subtitle">
            <span class="resume-item-org">${item.company || ""}</span>
            <span class="resume-item-loc">${item.location || ""}</span>
          </div>
          <div class="resume-item-desc">${formatBulletPoints(item.description)}</div>
        </div>
      `).join("")}
    </div>
  ` : "";

  const educationHTML = state.education.length > 0 ? `
    <div class="resume-section">
      <div class="resume-section-title">Education</div>
      ${state.education.map(item => `
        <div class="resume-item">
          <div class="resume-item-header">
            <span class="resume-item-title">${item.degree || "Untitled Degree"}</span>
            <span class="resume-item-date">${item.start || ""} ${item.end ? ` — ${item.end}` : ""}</span>
          </div>
          <div class="resume-item-subtitle">
            <span class="resume-item-org">${item.school || ""}</span>
            <span class="resume-item-loc">${item.location || ""}</span>
          </div>
          ${item.details ? `<div class="resume-item-desc" style="font-size: 0.92em;">${item.details}</div>` : ""}
        </div>
      `).join("")}
    </div>
  ` : "";

  const projectsHTML = state.projects.length > 0 ? `
    <div class="resume-section">
      <div class="resume-section-title">Projects</div>
      ${state.projects.map(item => `
        <div class="resume-item">
          <div class="resume-item-header">
            <span class="resume-item-title">
              ${item.title || "Untitled Project"} 
              ${item.tech ? `<span style="font-weight: normal; font-size: 0.85em; color: var(--resume-text-muted);">| ${item.tech}</span>` : ""}
            </span>
            <span class="resume-item-date">${item.date || ""}</span>
          </div>
          ${item.link ? `
            <div style="font-size: 0.82em; margin-bottom: 0.2rem;">
              <a href="${item.link}" target="_blank" style="color: var(--resume-theme-color); font-weight: 500;">
                ${item.link.replace(/^https?:\/\//, '')}
              </a>
            </div>
          ` : ""}
          <div class="resume-item-desc">${item.description ? `<p>${item.description}</p>` : ""}</div>
        </div>
      `).join("")}
    </div>
  ` : "";

  const skillsHTML = state.skills.length > 0 ? `
    <div class="resume-section">
      <div class="resume-section-title">Skills & Expertise</div>
      <div class="resume-skills-grid">
        ${state.skills.map(item => `
          <div class="resume-skill-cat">
            <strong>${item.category || "General"}:</strong>
            <span class="resume-skill-list">${item.skills || ""}</span>
          </div>
        `).join("")}
      </div>
    </div>
  ` : "";

  // 8. TEMPLATE COMPOSITIONS
  if (state.design.template === "minimal") {
    // Minimalist layout: Two column template
    doc.innerHTML = `
      <aside class="resume-sidebar">
        ${(photo && showPhoto !== false) ? `<img src="${photo}" class="resume-photo" alt="${fullname}">` : ""}
        <div>
          <h1 class="name">${fullname || "Your Name"}</h1>
          <div class="title">${jobtitle || "Professional Title"}</div>
        </div>
        ${contactHTML}
        ${skillsHTML}
      </aside>
      <main class="resume-main">
        ${summaryHTML}
        ${experienceHTML}
        ${projectsHTML}
        ${educationHTML}
      </main>
    `;
  } else if (state.design.template === "classic") {
    // Classic Centered Template
    doc.innerHTML = `
      <header class="resume-header">
        ${(photo && showPhoto !== false) ? `<img src="${photo}" class="resume-photo" alt="${fullname}">` : ""}
        <h1 class="name">${fullname || "Your Name"}</h1>
        <div class="title">${jobtitle || "Professional Title"}</div>
        ${contactHTML}
      </header>
      ${summaryHTML}
      ${experienceHTML}
      ${projectsHTML}
      ${educationHTML}
      ${skillsHTML}
    `;
  } else {
    // Modern Grid Template (Default)
    doc.innerHTML = `
      <header class="resume-header">
        ${(photo && showPhoto !== false) ? `<img src="${photo}" class="resume-photo" alt="${fullname}">` : ""}
        <div class="header-details">
          <h1 class="name">${fullname || "Your Name"}</h1>
          <div class="title">${jobtitle || "Professional Title"}</div>
        </div>
      </header>
      
      <div style="margin-bottom: 1.2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.8rem;">
        ${contactHTML}
      </div>

      ${summaryHTML}
      ${experienceHTML}
      ${projectsHTML}
      ${educationHTML}
      ${skillsHTML}
    `;
  }
}
