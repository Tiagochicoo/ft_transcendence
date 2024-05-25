import { User } from "/static/js/generators/index.js";

const sendNotification = ({ user, body }) => {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.querySelector('.toast-user').innerHTML = User.getBadge(user);
  toast.querySelector('.toast-body').innerHTML = body || '';

  bootstrap.Toast.getOrCreateInstance(toast).show();
};

export default sendNotification;
