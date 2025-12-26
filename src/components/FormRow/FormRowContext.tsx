import { createContext } from "react";

export interface FormRowContextValue {
  id: string;
  error?: string;
}

export const FormRowContext = createContext<FormRowContextValue | undefined>(
  undefined
);
