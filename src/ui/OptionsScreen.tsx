import React, { ChangeEvent, ChangeEventHandler, Dispatch, FormEvent, SetStateAction, useCallback } from "react";

import { HouseholdingOptions } from "../householder/main";

function useChangeTextOption<Field extends keyof HouseholdingOptions>(
  fieldName: Field,
  options: HouseholdingOptions,
  onChangeOptions: Dispatch<SetStateAction<HouseholdingOptions>>,
): [string, ChangeEventHandler<HTMLInputElement>] {
  const changeOptionValue = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const value = ev.currentTarget.value;

      onChangeOptions((options) => ({
        ...options,
        [fieldName]: value === "" ? undefined : value,
      }));
    },
    [fieldName, onChangeOptions],
  );

  return [options[fieldName] ?? "", changeOptionValue];
}

export default function OptionsScreen({
  numVoters,
  options,
  onChangeOptions,
  onHousehold,
}: {
  numVoters: number;
  options: HouseholdingOptions;
  onChangeOptions: Dispatch<SetStateAction<HouseholdingOptions>>;
  onHousehold: () => void;
}) {
  const clickHousehold = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      if (ev.currentTarget.reportValidity()) {
        onHousehold();
      }
    },
    [onHousehold],
  );

  const [password, changePassword] = useChangeTextOption("encrypt", options, onChangeOptions);

  return (
    <div className="container my-4">
      <div className="message">
        <div className="message-body">Loaded {numVoters} from export, ready to household.</div>
      </div>

      <h2 className="ld-subtitle">Householding options</h2>
      <p className="help">Options will be remembered from last time you use the householder</p>

      <form onSubmit={clickHousehold}>
        <div className="field">
          <label className="label">Encrypted Password</label>
          <div className="control">
            <input className="input" type="password" value={password} onChange={changePassword} />
          </div>
          <p className="help">
            If you are sending the file on for mail merge (e.g., to Election Workshop) please ensure you encrypt it by
            setting a password, or leave blank for no password
          </p>
        </div>

        <div className="field">
          <div className="control">
            <button className="button is-primary">Household</button>
          </div>
        </div>
      </form>
    </div>
  );
}
