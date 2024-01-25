const searchInput = document.querySelector('#search');
const formSubmit = document.querySelector('#form');
const containerPostEl = document.querySelector('.post');
const toastEl = document.querySelector('#toast');
const toastBodyEl = document.querySelector('.toast-body');

const getPost = async (id) => {
    try {
        const response = (await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`));

        if (!response.ok) {
            showTost(response.statusText);
            throw new Error(`${response.status} ${response.statusText}`);
        }
        const post = await response.json();
        createPost(post);
    } catch (e) {
        showTost(e.message);
    }
};

const getPostComments = async (id) => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);

        if (!response.ok) {
            showTost(response.statusText);
            throw new Error(`${response.status} ${response.statusText}`);
        }
        const comments = await response.json();
        createComments(comments);
    } catch (e) {
        showTost(e.message);
    }
};

formSubmit.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!(/^[1-9][0-9]?$|^100$/).test(searchInput.value)) {
        showTost('number should be in range from 0 to 100');
    } else {
        hideToast();
        if (containerPostEl.innerHTML.trim().length) containerPostEl.innerHTML = '';
        getPost(Number(searchInput.value));
    }
});

function hideToast() {
    toastEl.classList = 'fade hide';
}

function showTost(message) {
    toastBodyEl.textContent = message;
    toastEl.classList = 'fade show';
}

function createPost(post) {
    const html = `
        <div class="card col-md-5 mx-auto mt-4"">
            <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.body}</p>
                <button class='btn btn-sm btn-success rounded-pill btn-comments'>Show comments</button>
            </div>
        </div>
    `;

    containerPostEl.insertAdjacentHTML('beforeend', html);

    const commentBtn = document.querySelector('.btn-comments');

    commentBtn.addEventListener('click', () => {
        const comments = containerPostEl.querySelector('.card-comments');
        if (!comments) getPostComments(post.id);
    });
}

function createComments(comments) {
    const container = document.createElement('div');
    container.classList = 'card mt-4 card-comments';
    container.innerHTML = ` <div class="card-header">
                                Comments
                            </div>
                        `;

    const ul = document.createElement('ul');
    ul.classList = 'p-4';

    comments.forEach((comment) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="d-flex flex-start">
                <img
                    src="${generateImg()}"
                    class="rounded-circle bg-info-subtle h-100"
                    width="50"
                />
                <div class="ms-2">
                    <h6 class="fw-bold">${comment.name}</h6>
                    <span class='badge bg-primary'>${comment.email}</span>
                    <p>${comment.body}</p>
                </div>
            </div>
        `;
        li.classList = 'list-group list-group-flush shadow-lg p-3 mb-2 d-block';
        ul.appendChild(li);
    });

    container.appendChild(ul);

    containerPostEl.append(container);
}

function generateImg() {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${(Math.random() + 1).toString(36).substring(7)}`;
}
