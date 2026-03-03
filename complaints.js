const container = document.getElementById("complaintContainer");

let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

function saveComplaints() {
    localStorage.setItem("complaints", JSON.stringify(complaints));
}

function goBack() {
    window.location.href = "ceo-dashboard.html";
}

function loadComplaints() {

    if (!container) return;

    container.innerHTML = "";

    if (complaints.length === 0) {
        container.innerHTML = `
            <p class="text-gray-400 text-center mt-10">
                No complaints found
            </p>
        `;
        return;
    }

    complaints.forEach((c, index) => {

        const status = c.status || "new";

        const card = document.createElement("div");
        card.className = `
            bg-[#1c1c1f]
            rounded-2xl
            p-6
            shadow-lg
            border border-purple-500/20
            mb-6
        `;

        card.innerHTML = `
            <div class="flex justify-between items-start">

                <div>
                    <h3 class="text-xl font-semibold text-white">
                        ${c.username}
                    </h3>

                    <p class="text-sm text-gray-400 mt-1">
                        ${c.email}
                    </p>

                    <p class="text-xs text-gray-500 mt-1">
                        ${c.date}
                    </p>
                </div>

                <span class="
                    px-4 py-1 text-xs rounded-full
                    ${status === "inprogress"
                        ? "bg-red-600"
                        : "bg-purple-600"}
                ">
                    ${status === "inprogress" ? "In Progress" : "New"}
                </span>
            </div>

            <p class="mt-4 text-gray-300 leading-relaxed">
                ${c.message}
            </p>

            <div class="flex justify-end gap-3 mt-6">

                <button onclick="markSolved(${index})"
                    class="px-4 py-2 bg-green-600 text-white text-sm rounded-full hover:bg-green-700 transition">
                    Solved
                </button>

                <button onclick="markInProgress(${index})"
                    class="
                    px-4 py-2
                    ${status === "inprogress"
                        ? "bg-red-600"
                        : "bg-gray-700"}
                    text-white text-sm rounded-full hover:bg-red-700 transition">
                    In Progress
                </button>

            </div>
        `;

        container.appendChild(card);
    });
}

function markInProgress(index) {
    complaints[index].status = "inprogress";
    saveComplaints();
    loadComplaints();
}

function markSolved(index) {
    complaints.splice(index, 1);
    saveComplaints();
    loadComplaints();
}

loadComplaints();
