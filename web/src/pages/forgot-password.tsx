import React, { useState } from "react";
import { Box, Button } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";

import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrlClient } from "../utils/createUrlClient";

function ForgotPassword(): React.ReactElement {
  const [complete, setComplete] = useState<boolean>(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <div>
      <Wrapper>
        <Formik
          initialValues={{
            email: "",
          }}
          onSubmit={async function (values) {
            await forgotPassword(values);
            setComplete(true);
          }}
        >
          {({ isSubmitting }) =>
            complete ? (
              <Box>
                if an account with that email exists, we sent you an email
              </Box>
            ) : (
              <Form>
                <InputField name="email" placeholder="email" label="Email" />
                <Button
                  mt={4}
                  type="submit"
                  isLoading={isSubmitting}
                  variantColor="teal"
                >
                  Forgot Password
                </Button>
              </Form>
            )
          }
        </Formik>
      </Wrapper>
    </div>
  );
}

export default withUrqlClient(createUrlClient)(ForgotPassword);
