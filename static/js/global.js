async function getMoodEntries(){
    return fetch("{% url 'main:show_json' %}").then((res) => res.json())
}

async function refreshMoodEntries() {
  document.getElementById("mood_entry_cards").innerHTML = "";
  document.getElementById("mood_entry_cards").className = "";
  const moodEntries = await getMoodEntries();
  let htmlString = "";
  let classNameString = "";

  if (moodEntries.length === 0) {
      classNameString = "flex flex-col items-center justify-center min-h-[24rem] p-6";
      htmlString = `
          <div class="flex flex-col items-center justify-center min-h-[24rem] p-6">
              <img src="{% static 'image/sedih-banget.png' %}" alt="Sad face" class="w-32 h-32 mb-4"/>
              <p class="text-center text-gray-600 mt-4">Belum ada data mood pada mental health tracker.</p>
          </div>
      `;
  }
  else {
      classNameString = "columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 w-full"
      moodEntries.forEach((item) => {
          const mood = DOMPurify.sanitize(item.fields.mood);
          const feelings = DOMPurify.sanitize(item.fields.feelings);
          htmlString += `
          <div class="relative break-inside-avoid">
              <div class="absolute top-2 z-10 left-1/2 -translate-x-1/2 flex items-center -space-x-2">
                  <div class="w-[3rem] h-8 bg-gray-200 rounded-md opacity-80 -rotate-90"></div>
                  <div class="w-[3rem] h-8 bg-gray-200 rounded-md opacity-80 -rotate-90"></div>
              </div>
              <div class="relative top-5 bg-indigo-100 shadow-md rounded-lg mb-6 break-inside-avoid flex flex-col border-2 border-indigo-300 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div class="bg-indigo-200 text-gray-800 p-4 rounded-t-lg border-b-2 border-indigo-300">
                      <h3 class="font-bold text-xl mb-2">${mood}</h3>
                      <p class="text-gray-600">${time}</p>
                  </div>
                  <div class="p-4">
                      <p class="font-semibold text-lg mb-2">My Feeling</p>
                      <p class="text-gray-700 mb-2">
                          <span class="bg-[linear-gradient(to_bottom,transparent_0%,transparent_calc(100%_-_1px),#CDC1FF_calc(100%_-_1px))] bg-[length:100%_1.5rem] pb-1">${feelings}</span>
                      </p>
                      <div class="mt-4">
                          <p class="text-gray-700 font-semibold mb-2">Intensity</p>
                          <div class="relative pt-1">
                              <div class="flex mb-2 items-center justify-between">
                                  <div>
                                      <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                                          ${item.fields.mood_intensity > 10 ? '10+' : item.fields.mood_intensity}
                                      </span>
                                  </div>
                              </div>
                              <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                                  <div style="width: ${item.fields.mood_intensity > 10 ? 100 : item.fields.mood_intensity * 10}%;" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="absolute top-0 -right-4 flex space-x-1">
                  <a href="/edit-mood/${item.pk}" class="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-2 transition duration-300 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                  </a>
                  <a href="/delete/${item.pk}" class="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition duration-300 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                  </a>
              </div>
          </div>
          `;
      });
  }
  document.getElementById("mood_entry_cards").className = classNameString;
  document.getElementById("mood_entry_cards").innerHTML = htmlString;
}
refreshMoodEntries();

const modal = document.getElementById('crudModal');
const modalContent = document.getElementById('crudModalContent');

function showModal() {
    const modal = document.getElementById('crudModal');
    const modalContent = document.getElementById('crudModalContent');

    modal.classList.remove('hidden'); 
    setTimeout(() => {
      modalContent.classList.remove('opacity-0', 'scale-95');
      modalContent.classList.add('opacity-100', 'scale-100');
    }, 50); 
}

function hideModal() {
    const modal = document.getElementById('crudModal');
    const modalContent = document.getElementById('crudModalContent');

    modalContent.classList.remove('opacity-100', 'scale-100');
    modalContent.classList.add('opacity-0', 'scale-95');

    setTimeout(() => {
      modal.classList.add('hidden');
    }, 150); 
}

function addMoodEntry() {
  fetch("{% url 'main:add_mood_entry_ajax' %}", {
    method: "POST",
    body: new FormData(document.querySelector('#moodEntryForm')),
  })
  .then(response => refreshMoodEntries())

  document.getElementById("moodEntryForm").reset(); 
  document.querySelector("[data-modal-toggle='crudModal']").click();

  return false;
}

document.getElementById("cancelButton").addEventListener("click", hideModal);
document.getElementById("closeModalBtn").addEventListener("click", hideModal);
document.getElementById("submitMoodEntry").onclick = addMoodEntry