import React, { Component } from 'react';
import {
  signup,
  checkUsernameAvailability,
  checkEmailAvailability,
} from '../../util/APIUtils';
import './Signup.css';
import { Link } from 'react-router-dom';
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from '../../constants';

import { Form, Input, Button, notification } from 'antd';
const FormItem = Form.Item;

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: {
        value: '',
      },
      userName: {
        value: '',
      },
      userEmail: {
        value: '',
      },
      password: {
        value: '',
      },
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateUsernameAvailability = this.validateUsernameAvailability.bind(
      this
    );
    this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  handleInputChange(event, validationFun) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue),
      },
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const signupRequest = {
      teamName: this.state.teamName.value,
      userEmail: this.state.userEmail.value,
      userName: this.state.userName.value,
      password: this.state.password.value,
    };
    signup(signupRequest)
      .then(response => {
        notification.success({
          message: 'Polling App',
          description:
            "Thank you! You're successfully registered. Please Login to continue!",
        });
        this.props.history.push('/login');
      })
      .catch(error => {
        notification.error({
          message: 'Polling App',
          description:
            error.message || 'Sorry! Something went wrong. Please try again!',
        });
      });
  }

  isFormInvalid() {
    return !(
      this.state.teamName.validateStatus === 'success' &&
      this.state.userName.validateStatus === 'success' &&
      this.state.userEmail.validateStatus === 'success' &&
      this.state.password.validateStatus === 'success'
    );
  }

  render() {
    return (
      <div className="signup-container">
        <h1 className="page-title">Sign Up</h1>
        <div className="signup-content">
          <Form onSubmit={this.handleSubmit} className="signup-form">
            <FormItem
              label="Team Name"
              validateStatus={this.state.teamName.validateStatus}
              help={this.state.teamName.errorMsg}>
              <Input
                size="large"
                name="teamName"
                autoComplete="off"
                placeholder="Your TeamName"
                value={this.state.teamName.value}
                onChange={event =>
                  this.handleInputChange(event, this.validateName)
                }
              />
            </FormItem>
            <FormItem
              label="Username"
              hasFeedback
              validateStatus={this.state.userName.validateStatus}
              help={this.state.userName.errorMsg}>
              <Input
                size="large"
                name="userName"
                autoComplete="off"
                placeholder="A unique username"
                value={this.state.userName.value}
                onBlur={this.validateUsernameAvailability}
                onChange={event =>
                  this.handleInputChange(event, this.validateUsername)
                }
              />
            </FormItem>
            <FormItem
              label="Email"
              hasFeedback
              validateStatus={this.state.userEmail.validateStatus}
              help={this.state.userEmail.errorMsg}>
              <Input
                size="large"
                name="userEmail"
                type="email"
                autoComplete="off"
                placeholder="Your email"
                value={this.state.userEmail.value}
                onBlur={this.validateEmailAvailability}
                onChange={event =>
                  this.handleInputChange(event, this.validateEmail)
                }
              />
            </FormItem>
            <FormItem
              label="Password"
              validateStatus={this.state.password.validateStatus}
              help={this.state.password.errorMsg}>
              <Input
                size="large"
                name="password"
                type="password"
                autoComplete="off"
                placeholder="A password between 6 to 20 characters"
                value={this.state.password.value}
                onChange={event =>
                  this.handleInputChange(event, this.validatePassword)
                }
              />
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="signup-form-button">
                Sign up
              </Button>
              Already registed? <Link to="/login">Login now!</Link>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }

  // Validation Functions

  validateName = name => {
    if (name.length < NAME_MIN_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`,
      };
    } else if (name.length > NAME_MAX_LENGTH) {
      return {
        validationStatus: 'error',
        errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`,
      };
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
  };

  validateEmail = email => {
    if (!email) {
      return {
        validateStatus: 'error',
        errorMsg: 'Email may not be empty',
      };
    }

    const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
    if (!EMAIL_REGEX.test(email)) {
      return {
        validateStatus: 'error',
        errorMsg: 'Email not valid',
      };
    }

    if (email.length > EMAIL_MAX_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`,
      };
    }

    return {
      validateStatus: null,
      errorMsg: null,
    };
  };

  validateUsername = username => {
    if (username.length < USERNAME_MIN_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`,
      };
    } else if (username.length > USERNAME_MAX_LENGTH) {
      return {
        validationStatus: 'error',
        errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`,
      };
    } else {
      return {
        validateStatus: null,
        errorMsg: null,
      };
    }
  };

  validateUsernameAvailability() {
    // First check for client side errors in username
    const usernameValue = this.state.userName.value;
    const usernameValidation = this.validateUsername(usernameValue);

    if (usernameValidation.validateStatus === 'error') {
      this.setState({
        username: {
          value: usernameValue,
          ...usernameValidation,
        },
      });
      return;
    }

    this.setState({
      username: {
        value: usernameValue,
        validateStatus: 'validating',
        errorMsg: null,
      },
    });

    checkUsernameAvailability(usernameValue)
      .then(response => {
        if (response.available) {
          this.setState({
            username: {
              value: usernameValue,
              validateStatus: 'success',
              errorMsg: null,
            },
          });
        } else {
          this.setState({
            username: {
              value: usernameValue,
              validateStatus: 'error',
              errorMsg: 'This username is already taken',
            },
          });
        }
      })
      .catch(error => {
        // Marking validateStatus as success, Form will be recchecked at server
        this.setState({
          username: {
            value: usernameValue,
            validateStatus: 'success',
            errorMsg: null,
          },
        });
      });
  }

  validateEmailAvailability() {
    // First check for client side errors in email
    const emailValue = this.state.userEmail.value;
    const emailValidation = this.validateEmail(emailValue);

    if (emailValidation.validateStatus === 'error') {
      this.setState({
        email: {
          value: emailValue,
          ...emailValidation,
        },
      });
      return;
    }

    this.setState({
      email: {
        value: emailValue,
        validateStatus: 'validating',
        errorMsg: null,
      },
    });

    checkEmailAvailability(emailValue)
      .then(response => {
        if (response.available) {
          this.setState({
            email: {
              value: emailValue,
              validateStatus: 'success',
              errorMsg: null,
            },
          });
        } else {
          this.setState({
            email: {
              value: emailValue,
              validateStatus: 'error',
              errorMsg: 'This Email is already registered',
            },
          });
        }
      })
      .catch(error => {
        // Marking validateStatus as success, Form will be recchecked at server
        this.setState({
          email: {
            value: emailValue,
            validateStatus: 'success',
            errorMsg: null,
          },
        });
      });
  }

  validatePassword = password => {
    if (password.length < PASSWORD_MIN_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`,
      };
    } else if (password.length > PASSWORD_MAX_LENGTH) {
      return {
        validationStatus: 'error',
        errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`,
      };
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
  };
}

export default Signup;
