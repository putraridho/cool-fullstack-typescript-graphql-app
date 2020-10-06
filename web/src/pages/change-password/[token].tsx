import React, { useState } from "react";
import { Box, Button, Link } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import NextLink from "next/link";

import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { withUrqlClient } from "next-urql";
import { createUrlClient } from "../../utils/createUrlClient";

function ChangePassword(): React.ReactElement {
  const [tokenError, setTokenError] = useState<string>();
  const router = useRouter();
  const { token } = router.query as { token: string };
  const [, changePassword] = useChangePasswordMutation();
  return (
    <Wrapper>
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token,
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            console.log(errorMap);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            } else {
              setErrors(errorMap);
            }
          } else if (response.data?.changePassword.user) {
            // worked
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) =>
          tokenError ? (
            <Box style={{ textAlign: "center" }}>
              <Box style={{ color: "red" }}>{tokenError}</Box>
              <NextLink href="/forgot-password">
                <Link>click here to get a new one</Link>
              </NextLink>
            </Box>
          ) : (
            <Form>
              <InputField
                name="newPassword"
                placeholder="new password"
                label="New Password"
                type="password"
              />
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                variantColor="teal"
              >
                change password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrlClient, { ssr: false })(ChangePassword);
