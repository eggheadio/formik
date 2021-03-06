import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Field } from '../src/Field';
import { Formik } from '../src/formik';

// tslint:disable-next-line:no-empty
const noop = () => {};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const TestForm: React.SFC<any> = p =>
  <Formik
    onSubmit={noop}
    initialValues={{ name: 'jared', email: 'hello@reason.nyc' }}
    {...p}
  />;

describe('A <Field />', () => {
  describe('<Field component />', () => {
    const node = document.createElement('div');
    const placeholder = 'First name';
    const TEXT = 'Mrs. Kato';

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(node);
    });

    it('renders an <input /> by default', () => {
      ReactDOM.render(
        <TestForm render={formikProps => <Field name="name" />} />,
        node
      );

      expect((node.firstChild as HTMLInputElement).name).toBe('name');
    });

    it('renders the component', () => {
      const SuperInput = () =>
        <div>
          {TEXT}
        </div>;
      ReactDOM.render(
        <TestForm
          render={formikProps => <Field name="name" component={SuperInput} />}
        />,
        node
      );

      expect((node.firstChild as HTMLInputElement).innerHTML).toBe(TEXT);
    });

    it('renders string components', () => {
      ReactDOM.render(
        <TestForm
          render={formikProps => <Field component="textarea" name="name" />}
        />,
        node
      );

      expect((node.firstChild as HTMLTextAreaElement).name).toBe('name');
    });

    it('receives { field, form } props', () => {
      let actual;
      let injected;
      const Component = props => (actual = props) && null;

      ReactDOM.render(
        <TestForm
          render={formikProps =>
            (injected = formikProps) &&
            <Field name="name" component={Component} />}
        />,
        node
      );
      const { handleBlur, handleChange } = injected;
      expect(actual.field.name).toBe('name');
      expect(actual.field.value).toBe('jared');
      expect(actual.field.onChange).toBe(handleChange);
      expect(actual.field.onBlur).toBe(handleBlur);
      expect(actual.form).toEqual(injected);
    });
  });

  describe('<Field render />', () => {
    const node = document.createElement('div');
    const placeholder = 'First name';
    const TEXT = 'Mrs. Kato';

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(node);
    });

    it('renders its return value', () => {
      ReactDOM.render(
        <TestForm
          render={formikProps =>
            <Field
              name="name"
              render={props =>
                <div>
                  {TEXT}
                </div>}
            />}
        />,
        node
      );

      expect(node.innerHTML).toContain(TEXT);
    });

    it('receives { field, form } props', () => {
      ReactDOM.render(
        <TestForm
          render={formikProps =>
            <Field
              placeholder={placeholder}
              name="name"
              testingAnArbitraryProp="thing"
              render={({ field, form }) => {
                const { handleBlur, handleChange } = formikProps;
                expect(field.name).toBe('name');
                expect(field.value).toBe('jared');
                expect(field.onChange).toBe(handleChange);
                expect(field.onBlur).toBe(handleBlur);
                expect(form).toEqual(formikProps);

                return null;
              }}
            />}
        />,
        node
      );
    });
  });

  describe('<Field children />', () => {
    const node = document.createElement('div');

    const TEXT = 'Mrs. Kato';

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(node);
    });

    it('renders a function', () => {
      ReactDOM.render(
        <TestForm
          render={() =>
            <Field
              name="name"
              children={() =>
                <div>
                  {TEXT}
                </div>}
            />}
        />,
        node
      );

      expect(node.innerHTML).toContain(TEXT);
    });

    it('renders a child element', () => {
      ReactDOM.render(
        <TestForm
          render={() =>
            <Field name="name">
              <option value="Jared">
                {TEXT}
              </option>
            </Field>}
        />,
        node
      );

      expect(node.innerHTML).toContain(TEXT);
    });

    it('warns if both non-string component and children', () => {
      let output = '';
      let actual;
      const Component = props => (actual = props) && null;

      (global as any).console = {
        error: jest.fn(input => (output += input)),
      };

      ReactDOM.render(
        <TestForm
          render={() =>
            <Field component={Component} name="name">
              <option value="Jared">
                {TEXT}
              </option>
            </Field>}
        />,
        node
      );

      expect(output).toContain(
        'You should not use a non-string <Field component> and <Field children> in the same <Field> component; <Field component> will be ignored.'
      );
    });

    it('warns if both non-string component and render', () => {
      let output = '';
      let actual;
      const Component = props => (actual = props) && null;

      (global as any).console = {
        error: jest.fn(input => (output += input)),
      };

      ReactDOM.render(
        <TestForm
          render={() =>
            <Field
              component={Component}
              name="name"
              render={() =>
                <div>
                  {TEXT}
                </div>}
            />}
        />,
        node
      );

      expect(output).toContain(
        'You should not use <Field component> and <Field render> in the same <Field> component; <Field component> will be ignored'
      );
    });

    it('warns if both children and render', () => {
      let output = '';
      let actual;
      const Component = props => (actual = props) && null;

      (global as any).console = {
        error: jest.fn(input => (output += input)),
      };

      ReactDOM.render(
        <TestForm
          render={() =>
            <Field
              name="name"
              render={() =>
                <div>
                  {TEXT}
                </div>}
            >
              <div>
                {TEXT}
              </div>
            </Field>}
        />,
        node
      );

      expect(output).toContain(
        'You should not use <Field render> and <Field children> in the same <Field> component; <Field children> will be ignored'
      );
    });

    it('renders a child function', () => {
      ReactDOM.render(
        <TestForm
          render={() =>
            <Field name="name">
              {() =>
                <div>
                  {TEXT}
                </div>}
            </Field>}
        />,
        node
      );

      expect(node.innerHTML).toContain(TEXT);
    });

    it('receives { field, form } props', () => {
      let actual;
      let injected;
      const Component = props => (actual = props) && null;

      ReactDOM.render(
        <TestForm
          children={formikProps =>
            (injected = formikProps) &&
            <Field name="name" component={Component} placeholder="hello" />}
        />,
        node
      );
      const { handleBlur, handleChange } = injected;
      expect(actual.field.name).toBe('name');
      expect(actual.field.onChange).toBe(handleChange);
      expect(actual.field.onBlur).toBe(handleBlur);
      expect(actual.field.value).toBe('jared');
      expect(actual.form).toEqual(injected);
    });
  });
});
