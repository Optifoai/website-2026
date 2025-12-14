import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { Tab, Tabs } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { updateUserProfile } from "../../Redux/Actions/loginAction";
import { notify, EMPTY_OBJECT } from "../../utils/helpers";
import { useAuth } from "../../hooks/useAuth";
import LoaderSpiner from "../../hooks/LoaderSpiner";

function AccountPage({ dispatch, userDetails }) {
  const { user, getUserData } = useAuth();
  const { i18n } = useTranslation();

  const [state, setState] = useReducer(
    (s, a) => ({ ...s, ...a }),
    { tabValue: 1, loader: true }
  );

  /* ================= FORM ================= */
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      companyName: "",
      language: "en",
      phone: "",
      countryCode: "+91",
    },
  });

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const localUser = localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : EMPTY_OBJECT;

    const profile =
      user?.userProfile ??
      userDetails?.userProfile ??
      localUser;

    if (profile) {
      setValue("fullName", profile.fullName || "");
      setValue("email", profile.email || "");
      setValue("companyName", profile.companyDetails?.companyName || "");
      setValue("language", profile.languageSelected || "en");
      setValue("phone", profile.phone ? String(profile.phone) : "");
      setValue("countryCode", profile.countryCode || "+91");

      setState({ loader: false });
    }
  }, [user, userDetails, setValue]);

  /* ================= SUBMIT ================= */
  const onSubmit = (data) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      companyName: data.companyName,
      language: data.language,
      countryCode: data.countryCode,
      phone: data.phone,
    };

    dispatch(updateUserProfile(payload))
      .then((res) => {
        if (res?.statusCode === "1") {
          getUserData();
          notify("success", "Profile updated successfully");
        } else {
          notify("error", "Update failed");
        }
      })
      .catch(() => notify("error", "Something went wrong"));
  };

  if (state.loader) return <LoaderSpiner />;

  return (
    <div className="mt-4">
      <Tabs
        activeKey={state.tabValue}
        onSelect={(k) => setState({ tabValue: Number(k) })}
      >
        <Tab eventKey={1} title="Account Info">
          <form className="max-w-320 mt-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label>Name</label>
              <input
                className="form-control"
                {...register("fullName", { required: true })}
              />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                readOnly
                className="form-control"
                {...register("email")}
              />
            </div>

            <div className="mb-3">
              <label>Company</label>
              <input
                className="form-control"
                {...register("companyName", { required: true })}
              />
            </div>

            {/* PHONE INPUT */}
            <div className="mb-3">
              <label>Phone</label>
              <Controller
                name="phone"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <PhoneInput
                    country="in"
                    value={field.value || ""}
                    onChange={(value, country) => {
                      field.onChange(value);
                      setValue("countryCode", `+${country.dialCode}`);
                    }}
                    countryCodeEditable={false}
                  />
                )}
              />
            </div>

            {/* LANGUAGE */}
            <div className="mb-3">
              <label>Language</label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="en"
                    {...register("language")}
                    onChange={() => i18n.changeLanguage("en")}
                  />{" "}
                  English
                </label>{" "}
                &nbsp;
                <label>
                  <input
                    type="radio"
                    value="da"
                    {...register("language")}
                    onChange={() => i18n.changeLanguage("da")}
                  />{" "}
                  Dansk
                </label>
              </div>
            </div>

            <button className="btn btn-login w-100">
              Save Changes
            </button>
          </form>
        </Tab>
      </Tabs>
    </div>
  );
}

AccountPage.propTypes = {
  dispatch: PropTypes.func,
  userDetails: PropTypes.object,
};

const mapStateToProps = ({ login }) => ({
  userDetails: login?.userDetails,
});

export default connect(mapStateToProps)(AccountPage);
