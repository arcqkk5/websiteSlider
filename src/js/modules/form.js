export default class Form {
  constructor(form) {
    this.form = document.querySelector(form);
    this.inputs = document.querySelectorAll("input");
    this.message = {
      loading: "Загрузка!",
      success: "Спасибо, отправлено!",
      failure: "Что-то пошло не так...",
    };
    this.path = "assets/question.php";
  }

  clearInputs() {
    this.inputs.forEach((item) => {
      item.value = "";
    });
  }

  checkMailInputs() {
    const txtInputs = document.querySelectorAll('[type="email"]');

    txtInputs.forEach((input) => {
      input.addEventListener("keypress", (e) => {
        if (e.key.match(/[^a-z 0-9 @ \.]/gi)) {
          e.preventDefault();
        }
      });
    });
  }

  async postData(url, data) {
    let res = await fetch(url, {
      method: "POST",
      body: data,
    });

    return await res.text();
  }

  init() {
    try {
      this.checkMailInputs();
      this.form.forEach((item) => {
        item.addEventListener("submit", (e) => {
          e.preventDefault();

          let statusMessage = document.createElement("div");
          statusMessage.style.cssText = `
              margin-top: 15px;
              font-size: 18px;
              color: grey;
            `;
          item.parentNode.appendChild(statusMessage);

          statusMessage.textContent = this.message.loading;
          const formData = new FormData(item);

          this.postData(this.path, formData)
            .then((res) => {
              console.log(res);
              statusMessage.textContent = this.message.success;
            })
            .catch(() => {
              statusMessage.textContent = this.message.failure;
            })
            .finally(() => {
              this.clearInputs();
              setTimeout(() => {
                statusMessage.remove();
              }, 6000);
            });
        });
      });
    } catch (e) {}
  }
}
