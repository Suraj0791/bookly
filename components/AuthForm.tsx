// This is a special Next.js instruction. It tells the framework that this
// component needs to run in the user's web browser (the "client").
// Why? Because this component has interactive elements like form inputs
// and buttons that a user needs to interact with.
"use client";

// --- IMPORTING OUR TOOLS ---
// We're gathering all the necessary tools (or "imports") for our form.

// Zod is our "rulebook" maker. We use it to define the rules for our form fields
// (e.g., "email must be a valid email address", "password must be 8 characters long").
import { ZodType } from "zod";

// This is the "translator" that helps Zod (our rulebook) talk to React Hook Form (our form manager).
import { zodResolver } from "@hookform/resolvers/zod";

// This is our main "form manager" library. It handles all the complicated stuff
// like tracking what the user types, handling form submission, and showing error messages.
import {
  DefaultValues, // A TypeScript type for the form's starting values.
  FieldValues,   // A generic TypeScript type representing any form's data structure.
  Path,          // A TypeScript type to ensure our field names are correct.
  SubmitHandler, // A TypeScript type for our submission function.
  useForm,       // The main "hook" or function we use to create and manage our form.
  UseFormReturn, // The TypeScript type for the object that `useForm` gives us back.
} from "react-hook-form";

import { Button } from "@/components/ui/button"; 
import {
  Form,          // The main form container that connects all the pieces.
  FormControl,   // A wrapper for the actual input element (<input>).
  FormField,     // A component that connects a single input to our form's state.
  FormItem,      // A wrapper for a single field, including its label and error message.
  FormLabel,     // The text label for an input (e.g., "Email").
  FormMessage,   // A special component to display validation errors for a field.
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"; 

// This is the special "Link" component from Next.js. It allows users to navigate
// between pages of our app very quickly without a full page reload.
import Link from "next/link";

import { FIELD_NAMES, FIELD_TYPES } from "@/constants";

import FileUpload from "@/components/FileUpload";

// A custom "hook" for showing nice pop-up notifications (also called "toasts").
import { toast } from "@/hooks/use-toast";

// This is Next.js's "GPS". It lets us programmatically navigate the user to different pages.
import { useRouter } from "next/navigation";

// --- DEFINING THE COMPONENT'S BLUEPRINT (PROPS) ---

/**
 * These are the "Props" or properties our AuthForm component needs to work.
 * Think of it as a contract: "If you want to use me, you MUST give me these things."
 *
 * We use a TypeScript Generic `<T extends FieldValues>` to make this component reusable.
 *
 * What does `<T extends FieldValues>` mean in simple terms?
 * - `T` is a placeholder for a specific form's data shape. It's like a variable for types.
 * - `FieldValues` is a basic type from react-hook-form that just means "an object with some fields".
 * - `extends` is a constraint.
 * - So, `T extends FieldValues` means: "You can use any object shape for `T`, as long as it's a valid
 * form data object." This lets us use the same form component for both a simple sign-in form
 * (e.g., { email, password }) and a more complex sign-up form (e.g., { email, password, name, etc. }).
 */
interface Props<T extends FieldValues> {
  // 🛡️ schema: The Zod "rulebook" for validating this specific form's data.
  schema: ZodType<T>;

  // 🏠 defaultValues: The starting values for the form fields. For a new form,
  // this is usually an object with empty strings (e.g., { email: "", password: "" }).
  defaultValues: T;

  // 🚀 onSubmit: The function to run when the user clicks submit and the form is valid.
  // This function will handle the actual logic, like sending the data to a server.
  // It must return a Promise that resolves to an object indicating success or failure.
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;

  // 📝 type: A string to tell the component whether it should behave as a "SIGN_IN"
  // form or a "SIGN_UP" form. This helps us change titles, button text, etc.
  type: "SIGN_IN" | "SIGN_UP";
}

/**
 * The main Authentication Form component.
 * It's a "generic" component, meaning it can be configured to handle different
 * types of forms (like sign-in and sign-up) just by passing it different props.
 * It uses `react-hook-form` for state management, `zod` for validation, and
 * `shadcn/ui` for styling.
 */
const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  // Initialize the Next.js router so we can redirect the user after they log in or sign up.
  const router = useRouter();

  // A simple boolean flag to easily check if this is a sign-in form.
  // This makes our code more readable than writing `type === "SIGN_IN"` everywhere.
  const isSignIn = type === "SIGN_IN";

  /**
   * Here, we initialize our form manager, `react-hook-form`.
   * The `useForm` hook is the heart of our form. It gives us back an object
   * with all the necessary tools (`control`, `handleSubmit`, etc.).
   *
   * We pass it a configuration object:
   * - `resolver`: This is where we connect our Zod rulebook (`schema`) to the form.
   * The `zodResolver` makes sure that any data entered into the form is checked
   * against our Zod rules before submission.
   * - `defaultValues`: We provide the starting values for the form fields.
   */
  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  /**
   * This is our form submission handler.
   * NOTE: We don't call this function directly from the <form> element's onSubmit.
   * Instead, we pass it to `react-hook-form`'s own `handleSubmit` function, which
   * will first run all the validations. Only if the validations pass will our
   * function here be called with the clean, validated form data.
   *
   * The flow is:
   * 1. User clicks the submit button.
   * 2. `react-hook-form`'s `handleSubmit` intercepts this.
   * 3. It validates the form data against our Zod schema.
   * 4. If valid -> It calls OUR `handleSubmit` function below with the data.
   * 5. If invalid -> It displays the error messages next to the fields.
   */
  const handleSubmit: SubmitHandler<T> = async (data) => {
    // We call the `onSubmit` function that was passed in as a prop.
    // This function contains the actual logic for signing in or signing up (e.g., calling an API).
    const result = await onSubmit(data);

    // After the server responds, we check if the operation was successful.
    if (result.success) {
      // If it was a success, show a happy notification pop-up.
      toast({
        title: "Success",
        description: isSignIn
          ? "You have successfully signed in."
          : "You have successfully signed up.",
      });

      // And then navigate the user to the home page.
      router.push("/");
    } else {
      // If there was an error, show a red, destructive notification with the error message.
      toast({
        title: `Error ${isSignIn ? "signing in" : "signing up"}`,
        description: result.error ?? "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  // --- RENDERING THE FORM (THE VISIBLE PART) ---
  // This is the JSX that defines what our component looks like on the screen.
  return (
    <div className="flex flex-col gap-4">
      {/* Display a dynamic title based on whether it's a sign-in or sign-up form. */}
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn ? "Welcome back to BookWise" : "Create your library account"}
      </h1>

      {/* Display a dynamic description as well. */}
      <p className="text-light-100">
        {isSignIn
          ? "Access the vast collection of resources, and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to the library"}
      </p>

      {/*
        This is the main Form component from shadcn/ui.
        We use the "spread operator" `{...form}` to pass down all the methods and state
        from our `useForm` hook to all the child components of the form.
        This is how `FormField`, `FormControl`, etc., know about the form's state.
      */}
      <Form {...form}>
        {/*
          This is the actual HTML <form> element.
          Crucially, its `onSubmit` prop is wired to `form.handleSubmit(handleSubmit)`.
          This ensures our validation logic runs before our submission logic.
        */}
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full space-y-6"
        >
          {/*
            --- DYNAMIC FIELD RENDERING ---
            This is the clever part that makes our component reusable.
            Instead of hard-coding each form field (<Input type="email">, <Input type="password">, etc.),
            we dynamically create them by looping over the keys of the `defaultValues` object.

            - `Object.keys(defaultValues)` gets an array of the field names (e.g., ["email", "password"]).
            - `.map()` loops through this array, rendering a `FormField` for each name.
          */}
          {Object.keys(defaultValues).map((fieldName) => (
            <FormField
              key={fieldName}
              // `control` is an object from `useForm` that contains methods for registering components.
              // This is how `react-hook-form` knows this field exists.
              control={form.control}
              // The `name` prop tells the form which piece of state this field corresponds to.
              name={fieldName as Path<T>}
              // The `render` prop is a function that returns the actual JSX for the input.
              // It gives us a `field` object that contains `onChange`, `onBlur`, `value`, etc.
              // We must spread these props onto our input (`{...field}`) to wire it up.
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {/* Look up a user-friendly name for the field (e.g., "fullName" -> "Full Name"). */}
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    {/*
                      --- CONDITIONAL INPUT TYPE ---
                      Here, we check if the current field is the "universityCard".
                      - If it is, we render our special `FileUpload` component.
                      - If it's any other field, we render a standard `Input` component.
                    */}
                    {field.name === "universityCard" ? (
                      <FileUpload
                        type="image"
                        accept="image/*"
                        placeholder="Upload your ID"
                        folder="ids"
                        variant="dark"
                        // We connect the file upload's result to our form's state.
                        onFileChange={field.onChange}
                      />
                    ) : (
                      <Input
                        required
                        // We dynamically set the input type (e.g., "text", "password", "email")
                        // by looking it up in our `FIELD_TYPES` constant object.
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                        }
                        // This is the most important part! The spread operator `{...field}`
                        // automatically connects this input to `react-hook-form`, handling
                        // its value, onChange, onBlur, etc.
                        {...field}
                        className="form-input"
                      />
                    )}
                  </FormControl>
                  {/* This component will automatically display any validation error for this field. */}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="form-btn">
            {/* The button text also changes based on the form type. */}
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </Form>

      {/*
        Finally, we add a small text block at the bottom with a link to switch
        between the sign-in and sign-up pages.
      */}
      <p className="text-center text-base font-medium">
        {isSignIn ? "New to BookWise? " : "Already have an account? "}

        {/* We use the Next.js `Link` component for fast, client-side navigation. */}
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="font-bold text-primary"
        >
          {isSignIn ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};

// We export the component so it can be used in other parts of our application.
export default AuthForm;