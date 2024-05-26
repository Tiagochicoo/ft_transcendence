import { User } from "/static/js/generators/index.js";

const sendNotification = ({ user, body }) => {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.querySelector('.toast-user').innerHTML = user ? User.getBadge(user) : '';
  toast.querySelector('.toast-time').innerHTML = i18next.t("toast.just_now");
  toast.querySelector('.toast-body').innerHTML = body || '';

  bootstrap.Toast.getOrCreateInstance(toast).show();
};

export default sendNotification;
