/* =========================================
   LUIGI GIUSSANI HIGH SCHOOL
   Assignment Management System
   ========================================= */

/* =========================================
   TEACHER ACCOUNTS
   ========================================= */

const teachers = [
    {
        email: "mafabikenneth256@gmail.com",
        password: "kenneth256",
        name: "tr kenneth"
    },
    {
        email: "mafabikenneth256@gmail.com",
        password: "kenneth256",
        name: "Mr. Okello"
    },
    {
        email: "aisha@school.com",
        password: "aisha123",
        name: "Ms. Aisha"
    },
    {
        email: "peter@school.com",
        password: "peter123",
        name: "Mr. Peter"
    },
    {
        email: "namusoke@school.com",
        password: "namusoke123",
        name: "Mrs. Namusoke"
    },
    {
        email: "joseph@school.com",
        password: "joseph123",
        name: "Mr. Joseph"
    },
    {
        email: "grace@school.com",
        password: "grace123",
        name: "Ms. Grace"
    }
];


/* =========================================
   TEACHER LOGIN
   ========================================= */

function teacherLogin(event) {
    event.preventDefault();

    const email = document.getElementById("teacherEmail").value.trim();
    const password = document.getElementById("teacherPassword").value;

    const foundTeacher = teachers.find(teacher =>
        teacher.email.toLowerCase() === email.toLowerCase() &&
        teacher.password === password
    );

    if (!foundTeacher) {
        alert("Wrong email or password. Please try again.");
        return;
    }

    localStorage.setItem("teacherEmail", foundTeacher.email);
    localStorage.setItem("teacherName", foundTeacher.name);

   document.getElementById(
    "teacherAssignmentSection"
).style.display = "block";

window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
});


/* =========================================
   TEACHER LOGOUT
   ========================================= */

function teacherLogout() {
    localStorage.removeItem("teacherEmail");
    localStorage.removeItem("teacherName");
}


/* =========================================
   PROTECT TEACHER PAGES
   ========================================= */

function protectTeacherDashboard() {
    const teacherEmail = localStorage.getItem("teacherEmail");

    if (!teacherEmail) {
        window.location.href = "teacher-login.html";
    }
}


/* =========================================
   SHOW LOGGED-IN TEACHER
   ========================================= */

function showTeacherEmail() {
    const teacherEmail = localStorage.getItem("teacherEmail");
    const teacherName = localStorage.getItem("teacherName");

    const welcomeEmail = document.getElementById("teacherWelcomeEmail");

    if (welcomeEmail && teacherEmail) {
        welcomeEmail.textContent =
            "Logged in as: " + teacherName + " (" + teacherEmail + ")";
    }
}


/* =========================================
   SUBJECT AND CLASS SELECTION
   ========================================= */

function selectSubject(subjectName) {
    localStorage.setItem("selectedSubject", subjectName);
}

function selectClass(className) {
    localStorage.setItem("selectedClass", className);
}

function showSelectedSubject() {
    const subject = localStorage.getItem("selectedSubject");
    const title = document.getElementById("selectedSubjectTitle");

    if (title && subject) {
        title.textContent = subject + " - Select Class";
    }
}

function showAssignmentLocation() {
    const subject = localStorage.getItem("selectedSubject");
    const className = localStorage.getItem("selectedClass");

    const locationBox = document.getElementById("assignmentLocation");

    if (locationBox && subject && className) {
        locationBox.textContent =
            "You are posting work for: " + subject + " " + className;
    }
}


/* =========================================
   READ ASSIGNMENT FILE
   ========================================= */

let assignmentFileData = "";
let assignmentFileName = "";

function readAssignmentFile(input) {
    const file = input.files[0];

    if (!file) return;

    assignmentFileName = file.name;

    const reader = new FileReader();

    reader.onload = function(event) {
        assignmentFileData = event.target.result;
    };

    reader.readAsDataURL(file);
}


/* =========================================
   SAVE TEACHER ASSIGNMENT
   ========================================= */

function saveAssignment(event) {
    event.preventDefault();

    const title =
        document.getElementById("assignmentTitle").value.trim();

    const instructions =
        document.getElementById("assignmentInstructions").value.trim();

    const dueDate =
        document.getElementById("assignmentDueDate").value;

    const subject = localStorage.getItem("selectedSubject");
    const className = localStorage.getItem("selectedClass");
    const teacherEmail = localStorage.getItem("teacherEmail");
    const teacherName = localStorage.getItem("teacherName");

    if (!title || !instructions || !dueDate) {
        alert("Please fill in all assignment details.");
        return;
    }

    if (!assignmentFileData) {
        alert("Please attach the assignment paper or notes.");
        return;
    }

    const assignments =
        JSON.parse(localStorage.getItem("teacherAssignments")) || [];

    const newAssignment = {
        id: Date.now(),
        title: title,
        instructions: instructions,
        dueDate: dueDate,
        subject: subject,
        className: className,
        teacherEmail: teacherEmail,
        teacherName: teacherName,
        fileName: assignmentFileName,
        fileData: assignmentFileData,
        datePosted: new Date().toLocaleString()
    };

    assignments.push(newAssignment);

    localStorage.setItem(
        "teacherAssignments",
        JSON.stringify(assignments)
    );

    alert("Assignment posted successfully.");

    window.location.href = "teacher-dashboard.html";
}


/* =========================================
   LOAD ASSIGNMENTS FOR STUDENTS
   ========================================= */

function loadSubjectAssignments() {
    const subject = localStorage.getItem("selectedSubject");
    const className = localStorage.getItem("selectedClass");

    const assignments =
        JSON.parse(localStorage.getItem("teacherAssignments")) || [];

    const subjectAssignments = assignments.filter(assignment =>
        assignment.subject === subject &&
        assignment.className === className
    );

    const assignmentBox =
        document.getElementById("subjectAssignments");

    if (!assignmentBox) return;

    if (subjectAssignments.length === 0) {
        assignmentBox.innerHTML =
            "<p>No assignment has been posted for this subject yet.</p>";
        return;
    }

    assignmentBox.innerHTML = subjectAssignments.map(assignment => `
        <div class="assignment-card">

            <h3>${assignment.title}</h3>

            <p><strong>Due:</strong> ${assignment.dueDate}</p>
            <p><strong>Posted by:</strong> ${assignment.teacherName}</p>

            <p>${assignment.instructions}</p>

            <p>
                <strong>Attached work:</strong>
                ${assignment.fileName}
            </p>

            <a class="btn"
                href="${assignment.fileData}"
                download="${assignment.fileName}">
                Download Assignment
            </a>

            <button class="btn"
                onclick="openSubmissionForm(${assignment.id})">
                Submit Work
            </button>

        </div>
    `).join("");
}


/* =========================================
   STUDENT SUBMISSION
   ========================================= */

function openSubmissionForm(assignmentId) {
    const assignments =
        JSON.parse(localStorage.getItem("teacherAssignments")) || [];

    const assignment = assignments.find(
        item => item.id === assignmentId
    );

    if (!assignment) {
        alert("Assignment not found.");
        return;
    }

    localStorage.setItem(
        "currentAssignment",
        JSON.stringify(assignment)
    );

    window.location.href = "submit-work.html";
}


function loadSubmissionAssignment() {
    const assignment = JSON.parse(
        localStorage.getItem("currentAssignment")
    );

    const box = document.getElementById("submissionAssignmentDetails");

    if (!assignment || !box) return;

    box.innerHTML = `
        <h3>${assignment.title}</h3>
        <p><strong>Subject:</strong> ${assignment.subject}</p>
        <p><strong>Class:</strong> ${assignment.className}</p>
        <p><strong>Due:</strong> ${assignment.dueDate}</p>
        <p>${assignment.instructions}</p>
    `;
}


function submitStudentWork(event) {
    event.preventDefault();

    const studentName =
        document.getElementById("studentName").value.trim();

    const studentAnswer =
        document.getElementById("studentAnswer").value.trim();

    const assignment = JSON.parse(
        localStorage.getItem("currentAssignment")
    );

    if (!studentName || !studentAnswer) {
        alert("Please enter your name and your answer.");
        return;
    }

    if (!assignment) {
        alert("Assignment not found. Please open the assignment again.");
        return;
    }

    const submissions =
        JSON.parse(localStorage.getItem("studentSubmissions")) || [];

    const newSubmission = {
        id: Date.now(),
        studentName: studentName,
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        subject: assignment.subject,
        className: assignment.className,
        teacherEmail: assignment.teacherEmail,
        answer: studentAnswer,
        time: new Date().toLocaleString()
    };

    submissions.push(newSubmission);

    localStorage.setItem(
        "studentSubmissions",
        JSON.stringify(submissions)
    );

    saveSubmissionNotification(assignment, studentName);

    alert("Your work has been submitted successfully.");

    window.location.href = "subject.html";
}


/* =========================================
   TEACHER NOTIFICATIONS
   ========================================= */

function saveSubmissionNotification(assignment, studentName) {
    let notifications =
        JSON.parse(localStorage.getItem("teacherNotifications")) || [];

    notifications.push({
        teacherEmail: assignment.teacherEmail,
        studentName: studentName,
        subject: assignment.subject,
        className: assignment.className,
        assignmentTitle: assignment.title,
        time: new Date().toLocaleString(),
        read: false
    });

    localStorage.setItem(
        "teacherNotifications",
        JSON.stringify(notifications)
    );
}


function showTeacherNotifications() {
    const teacherEmail = localStorage.getItem("teacherEmail");

    if (!teacherEmail) return;

    const notifications =
        JSON.parse(localStorage.getItem("teacherNotifications")) || [];

    const myNotifications = notifications.filter(notification =>
        notification.teacherEmail === teacherEmail
    );

    const unreadNotifications = myNotifications.filter(notification =>
        notification.read === false
    );

    const notificationBox =
        document.getElementById("teacherNotifications");

    const notificationCount =
        document.getElementById("notificationCount");

    if (!notificationBox) return;

    if (notificationCount) {
        notificationCount.textContent = unreadNotifications.length;

        notificationCount.style.display =
            unreadNotifications.length > 0 ? "inline-block" : "none";
    }

    if (myNotifications.length === 0) {
        notificationBox.innerHTML =
            "<p>No student has submitted work yet.</p>";
        return;
    }

    notificationBox.innerHTML = myNotifications.map(notification => `
        <div class="notification 
            ${notification.read === false ? "unread" : ""}">

            <strong>${notification.studentName}</strong>
            submitted work for
            <strong>${notification.subject} ${notification.className}</strong>.

            <br>
            Assignment: ${notification.assignmentTitle}
            <br>
            <small>Submitted on: ${notification.time}</small>
        </div>
    `).join("");
}


function markNotificationsRead() {
    const teacherEmail = localStorage.getItem("teacherEmail");

    if (!teacherEmail) return;

    let notifications =
        JSON.parse(localStorage.getItem("teacherNotifications")) || [];

    notifications = notifications.map(notification => {
        if (notification.teacherEmail === teacherEmail) {
            notification.read = true;
        }
        return notification;
    });

    localStorage.setItem(
        "teacherNotifications",
        JSON.stringify(notifications)
    );

    showTeacherNotifications();
}


/* =========================================
   TEACHER SUBMISSIONS PAGE
   ========================================= */

function loadTeacherSubmissions() {
    const teacherEmail = localStorage.getItem("teacherEmail");

    if (!teacherEmail) return;

    const submissions =
        JSON.parse(localStorage.getItem("studentSubmissions")) || [];

    const mySubmissions = submissions.filter(submission =>
        submission.teacherEmail === teacherEmail
    );

    const box = document.getElementById("teacherSubmissions");

    if (!box) return;

    if (mySubmissions.length === 0) {
        box.innerHTML =
            "<p>No learner has submitted work for your assignments yet.</p>";
        return;
    }

    box.innerHTML = mySubmissions.map(submission => `
        <div class="submission-card">

            <h3>${submission.studentName}</h3>

            <p>
                <strong>Subject:</strong>
                ${submission.subject} ${submission.className}
            </p>

            <p>
                <strong>Assignment:</strong>
                ${submission.assignmentTitle}
            </p>

            <p>
                <strong>Submitted:</strong>
                ${submission.time}
            </p>

            <p><strong>Answer:</strong></p>

            <div class="student-answer">
                ${submission.answer}
            </div>

        </div>
    `).join("");
}
let currentSlide = 0;

const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");

function showSlide(number) {
    if (slides.length === 0) {
        return;
    }

    currentSlide = (number + slides.length) % slides.length;

    slides.forEach(function(slide, index) {
        slide.classList.toggle("active", index === currentSlide);
    });

    dots.forEach(function(dot, index) {
        dot.classList.toggle("active-dot", index === currentSlide);
    });
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

setInterval(function() {
    changeSlide(1);
}, 5000);

function toggleMenu() {
    const navigation = document.getElementById("navigation");

    if (navigation) {
        navigation.classList.toggle("show");
    }
}

function getUrlValue(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

const classCodes = {
    S1: "S1-2026",
    S2: "S2-2026",
    S3: "S3-2026",
    S4: "S4-2026",
    S5: "S5-2026",
    S6: "S6-2026"
};

function checkClassCode(event) {
    event.preventDefault();

    const selectedClass = getUrlValue("class");
    const enteredCode = document.getElementById("classCode").value.trim();
    const errorMessage = document.getElementById("codeError");

    if (classCodes[selectedClass] === enteredCode) {
        sessionStorage.setItem("allowedClass", selectedClass);

        document.getElementById("codeBox").classList.add("hidden");
        document.getElementById("subjectsBox").classList.remove("hidden");
        document.getElementById("subjectsTitle").textContent =
            selectedClass + " Subjects";
    } else {
        errorMessage.classList.remove("hidden");
    }
}

function openSubject(subjectName) {
    const selectedClass = getUrlValue("class");
    const allowedClass = sessionStorage.getItem("allowedClass");

    if (allowedClass !== selectedClass) {
        alert("Please enter the correct class code first.");
        return;
    }

    window.location.href =
        "subject.html?class=" +
        encodeURIComponent(selectedClass) +
        "&subject=" +
        encodeURIComponent(subjectName);
}

function loadClassInformation() {
    const selectedClass = getUrlValue("class");
    const classTitle = document.getElementById("classTitle");
    const accessTitle = document.getElementById("accessTitle");

    if (selectedClass && classTitle && accessTitle) {
        classTitle.textContent = selectedClass + " Class Portal";
        accessTitle.textContent = "Access " + selectedClass;
    }
}

function teacherLogin(event) {
    event.preventDefault();

    const email = document.getElementById("teacherEmail").value.trim();
    const password = document.getElementById("teacherPassword").value;
    const errorMessage = document.getElementById("loginError");

    if (
        email === "mafabikenneth256@gmail.com" &&
        password === "kenneth256"
    )
     {
        sessionStorage.setItem("teacherLoggedIn", "true");
        window.location.href = "teacher-dashboard.html";
    } else {
        errorMessage.classList.remove("hidden");
    }
}

function teacherLogout() {
    sessionStorage.removeItem("teacherLoggedIn");
}

function protectTeacherDashboard() {
    const loggedIn = sessionStorage.getItem("teacherLoggedIn");

    if (loggedIn !== "true") {
        window.location.href = "teacher-login.html";
    }
}

function loadTeacherSubjectClasses() {
    const subject = getUrlValue("subject");

    if (!subject) {
        return;
    }

    const title = document.getElementById("selectedSubjectTitle");
    const heading = document.getElementById("selectedSubjectHeading");

    if (title) {
        title.textContent = subject + " Classes";
    }

    if (heading) {
        heading.textContent = subject + " — Choose a Class";
    }

    const classIds = [
        "s1Subject",
        "s2Subject",
        "s3Subject",
        "s4Subject",
        "s5Subject",
        "s6Subject"
    ];

    classIds.forEach(function(id, index) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = subject + " S" + (index + 1);
        }
    });
}

function openTeacherClass(className) {
    const subject = getUrlValue("subject");

    if (!subject) {
        return;
    }

    window.location.href =
        "create-assignment.html?class=" +
        encodeURIComponent(className) +
        "&subject=" +
        encodeURIComponent(subject);
}

function showAssignmentLocation() {
    const className = getUrlValue("class") || "S1";
    const subjectName = getUrlValue("subject") || "Physics";
    const location = document.getElementById("assignmentLocation");

    if (location) {
        location.textContent =
            "Post work for " + subjectName + " in " + className + ".";
    }
}

function saveAssignment(event) {
    event.preventDefault();

    const className = getUrlValue("class") || "S1";
    const subjectName = getUrlValue("subject") || "Physics";

    const title = document.getElementById("assignmentTitle").value.trim();
    const instructions =
        document.getElementById("assignmentInstructions").value.trim();
    const dueDate = document.getElementById("dueDate").value;
    const fileInput = document.getElementById("assignmentFile");

    const fileName =
        fileInput.files.length > 0
            ? fileInput.files[0].name
            : "";

    const assignments =
        JSON.parse(localStorage.getItem("assignments")) || [];

    assignments.push({
        className: className,
        subjectName: subjectName,
        title: title,
        instructions: instructions,
        dueDate: dueDate,
        fileName: fileName,
        teacherName: "Demo Teacher"
    });

    localStorage.setItem("assignments", JSON.stringify(assignments));

    document.getElementById("successMessage").classList.remove("hidden");

    document.querySelector("form").reset();
}

function loadSubjectAssignments() {
    const selectedClass = getUrlValue("class") || "S1";
    const subject = getUrlValue("subject") || "Physics";

    const subjectClass = document.getElementById("subjectClass");
    const subjectTitle = document.getElementById("subjectTitle");
    const assignmentList = document.getElementById("assignmentList");

    if (!subjectClass || !subjectTitle || !assignmentList) {
        return;
    }

    subjectClass.textContent = selectedClass + " SUBJECT";
    subjectTitle.textContent = subject + " Assignments";

    const savedAssignments =
        JSON.parse(localStorage.getItem("assignments")) || [];

    const matchingAssignments = savedAssignments.filter(function(assignment) {
        return (
            assignment.className === selectedClass &&
            assignment.subjectName === subject
        );
    });

    if (matchingAssignments.length === 0) {
        assignmentList.innerHTML = `
            <div class="login-card">
                <div class="login-icon">📭</div>
                <h2>No assignments yet</h2>
                <p>Your teacher has not posted work for this subject.</p>
            </div>
        `;

        return;
    }

    assignmentList.innerHTML = "";

    matchingAssignments.forEach(function(assignment) {
        const card = document.createElement("article");
        card.className = "assignment-card";

        card.innerHTML = `
            <div class="assignment-top">
                <div>
                    <p class="small-title">ASSIGNMENT</p>
                    <h2>${escapeHtml(assignment.title)}</h2>
                </div>

                <span class="date-badge">
                    Due ${escapeHtml(assignment.dueDate)}
                </span>
            </div>

            <p>${escapeHtml(assignment.instructions)}</p>

            <div class="small-text">
                Posted by ${escapeHtml(assignment.teacherName)}
                ${
                    assignment.fileName
                        ? " | Attached file: " + escapeHtml(assignment.fileName)
                        : ""
                }
            </div>
        `;
// Add a Submit Work button to this assignment card.
const submissionActions = document.createElement("div");
submissionActions.className = "file-actions";

const submitButton = document.createElement("a");
submitButton.className = "button primary-button";
submitButton.href = "submit-work.html";
submitButton.textContent = "Submit Work";

submitButton.addEventListener("click", function (event) {
    event.preventDefault();

    // Keep the assignment details and support either subject field.
    const selectedAssignment = {
        ...assignment,
        subject: assignment.subject || assignment.subjectName
    };

    try {
        localStorage.setItem(
            "currentAssignment",
            JSON.stringify(selectedAssignment)
        );
    } catch (error) {
        console.error(error);

        alert(
            "The assignment could not be prepared for submission. " +
            "Browser storage may be full or unavailable."
        );

        return;
    }

    window.location.href = "submit-work.html";
});

submissionActions.appendChild(submitButton);
card.appendChild(submissionActions);
        assignmentList.appendChild(card);
    });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

loadClassInformation();
function openSubmissionForm(assignmentId) {
    const assignments =
        JSON.parse(localStorage.getItem("teacherAssignments")) || [];

    const assignment = assignments.find(
        item => String(item.id) === String(assignmentId)
    );

    if (!assignment) {
        alert("Assignment not found. Please open the subject again.");
        return;
    }

    localStorage.setItem(
        "currentAssignment",
        JSON.stringify(assignment)
    );

    window.location.href = "submit-work.html";
}