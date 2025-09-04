const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
const navList = document.querySelector('.nav-list');

mobileMenuIcon.addEventListener('click', () => {
    navList.classList.toggle('active');
    mobileMenuIcon.classList.toggle('active');
});

document.querySelectorAll('.nav-list a').forEach(navLink => {
    navLink.addEventListener('click', () => {
        navList.classList.remove('active');
        mobileMenuIcon.classList.remove('active');
    });
});
