// @author: Mr. Buckley

import {
  Box,
  Button,
  Heading,
  Image,
  Text,
  Link as ChakraLink,
  useColorMode,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  VStack,
  Alert,
} from "@chakra-ui/react";
import Link from "next/link";
import { FormEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MyInput } from "../../components";
import { AuthContext, AuthContextType } from "../../providers";
import { BookData } from "types/library";

type Name = "isbn" | "call_number" | "first_name" | "last_name";

const Add = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [bookData, setBookData] = useState({
    isbn: "",
    call_number: "",
    first_name: "",
    last_name: "",
  });
  const [missingFields, setMissingFields] = useState(Array<string>());

  const { auth } = useContext(AuthContext) as AuthContextType;

  const onChange = (e: FormEvent) => {
    const bData = { ...bookData };
    const el = e.target as HTMLInputElement;
    bData[el.name as Name] = el.value.toString().replace(/-|\s/g, "");
    setBookData(bData);
  };

  const onSubmit = async (e: FormEvent) => {
    console.log(bookData);
    console.log(process.env.API_URL);
    e.preventDefault();
    try {
      const res = await fetch(process.env.API_URL + "library/books/", {
        method: "POST",
        body: JSON.stringify(bookData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${auth.user.token}`,
        },
      });
      const json = await res.json();
      if (res.status === 400) {
        const fields = Object.keys(json);

        if (fields.includes("isbn") || fields.includes("call_number")) {
          let message = "Book already exists at this ISBN and Call Number.";
          if (!fields.includes("isbn"))
            message = message.replace("ISBN and ", "");
          if (!fields.includes("call_number"))
            message = message.replace(" and Call Number", "");
          setError(message);
          setMissingFields([]);
        } else {
          setError(
            "Could not autofill the following information. Please add it manually."
          );
          setMissingFields(fields);
        }
        setSuccess(undefined);
      } else {
        setError(undefined);
        setSuccess(`${json.title} (ISBN ${json.isbn}) added.`);
        setMissingFields([]);
      }
      //console.log("JSON", json);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Box marginY={4}>
        <Heading textAlign="center">Add Book</Heading>
        {error && <Alert>{error}</Alert>}
        {success && <Alert>{success}</Alert>}
        <Box
          as="form"
          textAlign="center"
          marginTop={4}
          onChange={onChange}
          onSubmit={onSubmit}
        >
          <div>
            <FormLabel htmlFor="isbn">ISBN</FormLabel>
            <MyInput
              pr="4.5rem"
              type="text"
              placeholder="Enter ISBN"
              name="isbn"
              id="isbn"
              isRequired={true}
              isDisabled={missingFields.length > 0}
            />
          </div>
          <div>
            <FormLabel htmlFor="callNumber">Call Number</FormLabel>
            <MyInput
              pr="4.5rem"
              type="tel"
              placeholder="Enter Merit Library Call Number"
              name="call_number"
              id="call_number"
              isRequired={true}
              isDisabled={missingFields.length > 0}
            />
          </div>
          {missingFields.map((field) => {
            let label = field
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
            label = label.toLowerCase().includes("name")
              ? "Author " + label
              : label;
            return (
              <div>
                <FormLabel htmlFor={field}>{label}</FormLabel>
                <MyInput
                  pr="4.5rem"
                  type="text"
                  placeholder={"Enter " + label}
                  name={field}
                  id={field}
                  isRequired={true}
                />
              </div>
            );
          })}
          <div>
            <Input type="submit" value="Submit" bg="red.900" color="white" />
          </div>
        </Box>
      </Box>
    </>
  );
};

export default Add;
