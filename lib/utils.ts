/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { AxiosError } from "axios";
import { CountryCode, Products } from "plaid";

//const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@!?&.*%$])(?=.*\d)$/;
//constants
const nameRegex = /^[A-Za-z\s'-]+$/;
const ssnRegex = /^\d{4}$/;
const postalCodeRegex = /^\d{5}$/;
const dobRegex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError).isAxiosError === true;
};

// Function to handle errors and throw custom exceptions
export const handlePlaidError = (
  plaidError: PlaidErrorResponse,
  accessToken: string
) => {
  switch (plaidError.error_code) {
    case "INVALID_ACCESS_TOKEN":
      throw createError(
        "reauthenticate",
        "User login required. Please re-authenticate.",
        accessToken
      );
    case "ITEM_LOGIN_REQUIRED":
      throw createError(
        "reauthenticate",
        "User login required. Please re-authenticate.",
        accessToken
      );
    case "ADDITIONAL_CONSENT_REQUIRED":
      if (plaidError.error_message === ERROR_TYPES.PRODUCT_TRANSACTIONS) {
        throw createError(
          "addConsent",
          ERROR_TYPES.PRODUCT_TRANSACTIONS,
          accessToken
        );
      }

    default:
      throw createError("displayError", plaidError.error_message);
  }
};

//tooltip message
export const card_message: string = `You can obtain funds by copying the shareable Id present at the bottom of each card. This is an encoded Id of your account
            that you can share with friends or trusted parties that they will use to send money to your account and vice versa via the transfer funds section.`;
export const signup_message: string = `On signing up, you will be required to connect to a bank account to further explore the application features. Kindly note 
            that since this is a sandbox server connection, it is recommended to authenticate using the Chase Banking
            network. Credentials will be authenticated via Platypus. Plaid Savings and Checking accounts are usually configured
            with data on Plaid's test network. user_good can be used to pass credential check in.`;
export const transfer_email: string = `The email of the receipient needs to be already signed up with this application for you to be able to transfer funds `;

// // Define an array of images with src and alt text
// export const images = [
//   {
//     src: "/icons/auth-res.png",
//     alt: "Auth image background 1",
//   },
//   {
//     src: "/icons/auth-res2.png",
//     alt: "Auth image background 2",
//   },
//   {
//     src: "/icons/auth-res3.png",
//     alt: "Auth image background 3",
//   },
// ];

// Define error types
export const ERROR_TYPES = {
  INVALID_TOKEN: "INVALID_TOKEN",
  DISPLAY_ERROR: "DISPLAY_ERROR",
  CONSENT_REQUIRED: "ADDITIONAL_CONSENT_REQUIRED",
  PRODUCT_TRANSACTIONS:
    "client does not have user consent to access the PRODUCT_TRANSACTIONS product",
};

// Custom error function
export const createError = (
  action: "reauthenticate" | "displayError" | "addConsent",
  message: string,
  token?: string
) => ({
  action,
  message,
  token,
});

//type guard for create Error
export const isCreateError = (error: any): error is CreateError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "action" in error &&
    "message" in error &&
    (error.action === "reauthenticate" ||
      error.action === "displayError" ||
      error.action === "addConsent")
  );
};

//type guard for error action
export const isPlaidErrorAction = (
  error: unknown
): error is PlaidErrorAction => {
  return (
    typeof error === "object" &&
    error !== null &&
    "action" in error &&
    "message" in error
  );
};

// Define the TokenParams interface
export interface TokenParams {
  user: {
    client_user_id: string;
  };
  client_name: string;
  language: string;
  products: Products[];
  country_codes: CountryCode[];
  access_token?: string; // Optional property for update mode
  additional_consented_products?: Products[];
}

export function paymentTransferFormSchema() {
  return z.object({
    email: z.string().email("Invalid email address"),
    name: z.string().min(4, "Transfer note is too short"),
    amount: z.string().min(4, "Amount is too short"),
    senderBank: z.string().min(4, "Please select a valid bank account"),
    sharableId: z.string().min(8, "Please select a valid sharable Id"),
  });
}
// zod is a form validator component
// Here we enter in the attributes for validation in our form
export const authFormSchema = (type: string) =>
  z.object({
    email: z
      .string()
      .min(1, { message: "Email address is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" }),
    address1:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(1, { message: "Address is required" }),
    city:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(1, { message: "City is required" }),
    state:
      type === "sign-in"
        ? z.string().optional()
        : z
            .string()
            .min(2, { message: "State is required" })
            .max(2, { message: "Enter State Initials correctly" }),
    postalCode:
      type === "sign-in"
        ? z.string().optional()
        : z
            .string()
            .min(1, { message: "Postal Code is required" })
            .max(5, { message: "Enter valid Postal Code" })
            .regex(postalCodeRegex, {
              message:
                "Postal code must be a valid format (e.g., 12345 or 12345-6789)",
            }),
    dateOfBirth:
      type === "sign-in"
        ? z.string().optional()
        : z
            .string()
            .regex(dobRegex)
            .refine(
              (date) => {
                const today = new Date();
                const parseDate = new Date(date);
                return today > parseDate;
              },
              { message: "Enter valid date of birth" }
            )
            .refine(
              (date) => {
                const today = new Date();
                const parseDate = new Date(date);

                return today.getFullYear() - parseDate.getFullYear() >= 18;
              },
              { message: "Customer should be above 18 to register an account" }
            ),
    ssn:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(1, { message: "SSN is required" }).regex(ssnRegex),
    firstName:
      type === "sign-in"
        ? z.string().optional()
        : z
            .string()
            .min(1, { message: "First name is required" })
            .regex(nameRegex, {
              message:
                "First name can only contain letters, spaces, hyphens, or apostrophes",
            }),

    lastName:
      type === "sign-in"
        ? z.string().optional()
        : z
            .string()
            .min(1, { message: "Last name is required" })
            .regex(nameRegex, {
              message:
                "Last name can only contain letters, spaces, hyphens, or apostrophes",
            }),
  });

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const removeSpecialCharacters = (value: string | undefined) => {
  if (value === undefined || value === null) {
    console.error("Received an undefined or null value:", value);
    return ""; // Handle the case appropriately
  }

  if (typeof value !== "string") {
    console.error("Expected a string but received:", typeof value, value);
    return "";
  }

  try {
    const res = value.replace(/[^\w\s]/gi, "");
    return res;
  } catch (error) {
    console.error("An error occurred in removeSpecialCharacters:", error);
    return "";
  }
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function getAccountTypeColors(type: AccountTypes) {
  switch (type) {
    case "depository":
      return {
        bg: "bg-blue-25",
        lightBg: "bg-blue-100",
        title: "text-blue-900",
        subText: "text-blue-700",
      };

    case "credit":
      return {
        bg: "bg-success-25",
        lightBg: "bg-success-100",
        title: "text-success-900",
        subText: "text-success-700",
      };

    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}

export function countTransactionCategories(
  transactions: Transaction[]
): CategoryCount[] {
  const categoryCounts: { [category: string]: number } = {};
  let totalCount = 0;

  // Iterate over each transaction
  transactions &&
    transactions.forEach((transaction) => {
      // Extract the category from the transaction
      const category = transaction.category;

      // If the category exists in the categoryCounts object, increment its count
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        // Otherwise, initialize the count to 1
        categoryCounts[category] = 1;
      }

      // Increment total count
      totalCount++;
    });

  // Convert the categoryCounts object to an array of objects
  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map(
    (category) => ({
      name: category,
      count: categoryCounts[category],
      totalCount,
    })
  );

  // Sort the aggregatedCategories array by count in descending order
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}

export function extractCustomerIdFromUrl(url: string) {
  // Split the URL string by '/'
  const parts = url.split("/");

  // Extract the last part, which represents the customer ID
  const customerId = parts[parts.length - 1];

  return customerId;
}

export function encryptId(id: string) {
  return btoa(id);
}

export function decryptId(id: string) {
  return atob(id);
}

export const getTransactionStatus = (date: Date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Processing" : "Success";
};
