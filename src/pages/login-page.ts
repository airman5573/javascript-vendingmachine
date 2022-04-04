import Component from '../abstract/component';
import { ACCESS_TOKEN_KEY, API_URL } from '../constants';
import { customElement } from '../decorators/decortators';
import { FieldSet, Feedback, UserInfo } from '../types';
import { validateLoginEmail, validateLoginPassword } from '../validation/validators';

type FeedbackRecord = {
  email: Feedback;
  password: Feedback;
};
@customElement('login-page')
class LoginPage extends Component {
  private initialFeedbacks: FeedbackRecord = {
    email: {
      inputValue: '',
      hasError: false,
      errorMessage: '',
    },
    password: {
      inputValue: '',
      hasError: false,
      errorMessage: '',
    },
  };

  private feedbacks = { ...this.initialFeedbacks };

  fieldsetTemplate({ label, name, placeholder, feedback, type }: FieldSet) {
    return `
      <fieldset class="mb-4">
        <label for="${name}">${label}</label>
        <input id="${name}" type="${type}" name="${name}" placeholder="${placeholder}" value="${
      feedback.inputValue
    }" class="form-control ${feedback.hasError ? 'has-error' : ''}" />
        ${feedback.hasError ? `<div class="error-message">${feedback.errorMessage}</div>` : ''}
      </fieldset>
    `;
  }

  template(feedbacks: FeedbackRecord): string {
    return `
      <header class="mb-12">
        <h1>로그인</h1>
      </header>
      <form>
        ${this.fieldsetTemplate({
          label: '이메일',
          name: 'email',
          placeholder: 'woowacourse@gmail.com',
          feedback: feedbacks.email,
          type: 'text',
        })}
        ${this.fieldsetTemplate({
          label: '비밀번호',
          name: 'password',
          placeholder: '비밀번호를 입력해주세요',
          feedback: feedbacks.password,
          type: 'password',
        })}
        <button type="button" class="btn btn-primary full">확인</button>
      </form>
      <div>
        <span>아직 회원이 아니신가요?</span><a href="/register">회원가입</a>
      </div>
    `;
  }

  setEvent() {
    this.addEvent('click', 'button', this.onClickLoginBtn);
  }

  setFeedbacks(feedbacks: FeedbackRecord) {
    this.feedbacks = { ...feedbacks };
    this.render();
  }

  onClickLoginBtn = () => {
    const feedbacks = this.validate();
    this.setFeedbacks(feedbacks);
    const hasError = (Object.keys(feedbacks) as Array<keyof FeedbackRecord>).some(
      (key) => feedbacks[key].hasError
    );
    if (!hasError) {
      const [email, password] = [feedbacks.email.inputValue, feedbacks.password.inputValue];
      this.login({ email, password });
    }
  };

  login({ email, password }: Omit<UserInfo, 'name'>) {
    fetch(`${API_URL}/login`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        const { accessToken, user, errorMessage } = body;
        if (errorMessage) {
          alert(errorMessage);
          return;
        }
        console.log(accessToken, user);
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        alert('로그인 성공');
        location.href = `${location.origin}`;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  validate() {
    const feedbacks = { ...this.initialFeedbacks };
    const inputNames = ['email', 'password'];
    const inputs: Array<HTMLInputElement> = inputNames.map(
      (name) => this.querySelector(`input[name="${name}"]`) as HTMLInputElement
    );
    const [email, password] = inputs.map(($input) => $input.value.trim());

    feedbacks.email.inputValue = email;
    const { hasError: emailHasError, errorMessage: emailErrorMessage } = validateLoginEmail(email);
    if (emailHasError)
      feedbacks.email = {
        ...feedbacks.email,
        hasError: emailHasError,
        errorMessage: emailErrorMessage,
      };

    feedbacks.password.inputValue = password;
    const { hasError: passwordHasError, errorMessage: passwordErrorMessage } =
      validateLoginPassword(password);
    if (passwordHasError)
      feedbacks.password = {
        ...feedbacks.password,
        hasError: passwordHasError,
        errorMessage: passwordErrorMessage,
      };

    return feedbacks;
  }

  mount() {
    this.render();
  }

  render() {
    this.innerHTML = this.shouldRender() ? this.template(this.feedbacks) : '';
  }
}

export default LoginPage;
