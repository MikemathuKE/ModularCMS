"use client";

import React, { useState } from "react";
import {
  Form,
  TextInput,
  EmailInput,
  PasswordInput,
  NumberInput,
  CheckboxInput,
  RadioInput,
  FileInput,
  DateInput,
  RangeInput,
  SelectInput,
  TextArea,
  FieldWrapper,
  Option,
} from "@/components/FormElements";
import { Button, Heading3 } from "@/components/GeneralComponents";

interface FormData {
  name: string;
  email: string;
  password: string;
  age: number;
  acceptTerms: boolean;
  gender: string;
  file?: File | null;
  dob: string;
  volume: number;
  feedback: string;
  role: string;
}

const initialState: FormData = {
  name: "",
  email: "",
  password: "",
  age: 0,
  acceptTerms: false,
  gender: "",
  file: null,
  dob: "",
  volume: 50,
  feedback: "",
  role: "",
};

export default function ExampleForm() {
  const [data, setData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    let fieldValue: boolean | string | null | File | undefined = target.value;

    if (
      target instanceof HTMLInputElement &&
      (target.type === "checkbox" || target.type === "radio")
    ) {
      const checked = target.checked;
    } else if (target.type === "file" && (target as HTMLInputElement).files) {
      fieldValue = (target as HTMLInputElement).files?.[0];
    } else {
      const value = target.value;
    }

    if (fieldValue !== undefined) {
      setData((prev) => ({
        ...prev,
        [target.name]: fieldValue,
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.name) newErrors.name = "Name is required";
    if (!data.email.includes("@")) newErrors.email = "Email is invalid";
    if (data.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (data.age < 18) newErrors.age = "You must be at least 18";
    if (!data.acceptTerms) newErrors.acceptTerms = "You must accept terms";
    if (!data.gender) newErrors.gender = "Gender is required";
    if (!data.dob) newErrors.dob = "Date of birth is required";
    if (!data.feedback) newErrors.feedback = "Feedback is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    alert("Form submitted successfully!");
  };

  return (
    <Form onSubmit={handleSubmit} contentType="null" formTitle="Form">
      <Heading3>Contact Form</Heading3>
      <FieldWrapper label="Name" error={errors.name}>
        <TextInput name="name" value={data.name} onChange={handleChange} />
      </FieldWrapper>

      <FieldWrapper label="Email" error={errors.email}>
        <EmailInput name="email" value={data.email} onChange={handleChange} />
      </FieldWrapper>

      <FieldWrapper label="Password" error={errors.password}>
        <PasswordInput
          name="password"
          value={data.password}
          onChange={handleChange}
        />
      </FieldWrapper>

      <FieldWrapper label="Age" error={errors.age}>
        <NumberInput name="age" value={data.age} onChange={handleChange} />
      </FieldWrapper>

      <FieldWrapper label="Date of Birth" error={errors.dob}>
        <DateInput name="dob" value={data.dob} onChange={handleChange} />
      </FieldWrapper>

      <FieldWrapper
        label="Accept Terms"
        error={errors.acceptTerms}
        style={{ flexDirection: "row" }}
      >
        <CheckboxInput
          name="acceptTerms"
          checked={data.acceptTerms}
          onChange={handleChange}
        />
      </FieldWrapper>

      <FieldWrapper
        label="Gender"
        error={errors.gender}
        style={{ flexDirection: "row" }}
      >
        <RadioInput
          name="gender"
          value="male"
          checked={data.gender === "male"}
          onChange={handleChange}
        />{" "}
        Male{" "}
        <RadioInput
          name="gender"
          value="female"
          checked={data.gender === "female"}
          onChange={handleChange}
        />{" "}
        Female
      </FieldWrapper>

      <FieldWrapper label="Upload CV">
        <FileInput name="file" onChange={handleChange} />
      </FieldWrapper>

      <FieldWrapper label="Volume">
        <RangeInput
          name="volume"
          value={data.volume}
          min={0}
          max={100}
          step={1}
          onChange={handleChange}
        />
      </FieldWrapper>

      <FieldWrapper label="Role">
        <SelectInput name="role" value={data.role} onChange={handleChange}>
          <Option value="">--Select--</Option>
          <Option value="admin">Admin</Option>
          <Option value="editor">Editor</Option>
          <Option value="viewer">Viewer</Option>
        </SelectInput>
      </FieldWrapper>

      <FieldWrapper label="Feedback" error={errors.feedback}>
        <TextArea
          name="feedback"
          value={data.feedback}
          onChange={handleChange}
        />
      </FieldWrapper>

      <FieldWrapper>
        <Button type="submit">Submit</Button>
      </FieldWrapper>
    </Form>
  );
}
