import React from 'react';
import { Field, reduxForm } from 'redux-form'
import * as actions from 'actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';


class SignInForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {error:null, addErrorClass: false};
  }

  renderField(field){
    const {meta} = field;
    const lblClass = meta.touched && meta.error ? 'text--danger':'';
    const inputErr = `input-group ${meta.touched && meta.error ? 'got-danger':''}`;
    return (
      <div className={inputErr}>
        <label className={lblClass}>{meta.touched && meta.error ? meta.error: field.label}</label>
        <field.field
          className="mjl-input input--underlined"
          type={field.type}
          autoComplete="off"
          {...field.input}
        />
        <div className="text-help"></div>
      </div>
    );
  }

  onSubmit = formProps => {
    // Return in order to disable submit button while fetching
    return this.props.signIn(formProps, (error) => {
      if(error){
        this.setState({error: error, addErrorClass:true}, ()=>{
          setTimeout(() => {
            this.setState({ addErrorClass:false });
          }, 250)
        });
      }else{
        this.props.closeModal();
        this.props.history.push('/');
      }
    });
  }
  __renderSigninError(){
    if(this.state.error){
      if(this.state.addErrorClass){
        return <span className="text--danger block-strong jitter-err">{this.state.error}</span>;
      }else{
        return <span className="text--danger block-strong">{this.state.error}</span>;
      }
    }
  }
  render(){
    const { handleSubmit, submitting, invalid } = this.props;
    return (
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <Field
          type="input"
          field="input"
          label="Your username or email"
          name="email"
          component={this.renderField}/>

          <Field
          type="password"
          field="input"
          label="Your password"
          name="password"
          component={this.renderField}/>

          <div style={{display:'block',height:30+'px',marginTop:12+'px'}}>{this.__renderSigninError()}</div>

          <button type="submit" disabled={invalid || submitting} className="mjl-btn btn--dark">Log In</button>
        </form>
    )
  }
};

/*
 Redux Custom validation. Gets called upon each form actions
 */
function validate(values){
  const errors = {};
  // Validate the inputs from 'values'
  if (!values.email){
    errors.email = "Please enter a valid email";
  }
  if (!values.password){
    errors.password = "Please enter your password";
  }
  return errors;
}

export default compose(
  // First args in state, second tim actions object
  connect(null, actions),
  reduxForm({
    validate,
    form: 'signInForm'
  }),
  withRouter
)(SignInForm);
