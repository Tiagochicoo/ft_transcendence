const sendNotification = ({ img, author, body }) => {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.querySelector('.toast-img').src = img || '';
  toast.querySelector('.toast-author').innerHTML = author || '';
  toast.querySelector('.toast-body').innerHTML = body || '';

  bootstrap.Toast.getOrCreateInstance(toast).show();
};

export default sendNotification;
