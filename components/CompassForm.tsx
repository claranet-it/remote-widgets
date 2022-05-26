import { useState, FormEvent } from "react";
import { UserData } from "../src/auth/useUser";
import { useCompass, Compass } from "../src/compass/useCompass";
import RadioFieldset from "./RadioFieldset";

const createURL = (userId: string, withDate = true) : string => {
  const base = `${window.location.origin}/api/${userId}.svg`;
  return withDate ? `${base}?date=${Date.now()}}` : base;
};

const CompassForm = ({ user }: { user: UserData }) => {
  const { compass, onChangeCompass } = useCompass(user.id);
  const [url, setUrl] = useState(createURL(user.id));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formTarget = event.target as HTMLFormElement;
    const form = new FormData(formTarget);
    const data: Compass = Object.fromEntries(form.entries()) as Compass;
    setUrl(createURL(user.id));
    onChangeCompass(data);
  };

  const onCopyURLClicked = () => {
    navigator.clipboard
      .writeText(createURL(user.id, false))
      .then(
        function () {
          console.log("Async: Copying to clipboard was successful!");
        },
        function (err) {
          console.error("Async: Could not copy text: ", err);
        }
      );
  };

  return (
    <div>
      {compass && (
        <div className="slidecontainer">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Widget title"
              defaultValue={compass.title}
            />
            <RadioFieldset
              title="PRESENCE IN THE OFFICE"
              name="presence"
              options={[
                "In-office 5/5",
                "In-office 1...4/5",
                "Office-first Hybrid",
                "Remote-first Hybrid",
                "Remote-only",
              ]}
              initialValue={compass.presence}
            />
            <RadioFieldset
              title="HOME"
              name="home"
              options={[
                "Live in office location",
                "Live in 1h from the office",
                "Anywhere in the country",
                "Anywhere in E.U.",
                "Anywhere with internet",
              ]}
              initialValue={compass.home}
            />
            <RadioFieldset
              title="COMPENSATION"
              name="compensation"
              options={[
                "Dependent on Location",
                "",
                "Weakly dependent on location",
                "",
                "Indipendent of Location",
              ]}
              initialValue={compass.compensation}
            />
            <RadioFieldset
              title="MEETINGS"
              name="meetings"
              options={[
                "Office 100%",
                "Possibility to partecipate remotely",
                "Possibility to stay in the office with the headphones",
                "Remote 99.9%, we rent a space when we need",
                "Remote 100%",
              ]}
              initialValue={compass.meetings}
            />
            <RadioFieldset
              title="COMUNICATION"
              name="communication"
              options={[
                "Synchronous 100%",
                "Synchronous 75% / Asynchronous 25%",
                "Synchronous 50% / Asynchronous 50%",
                "Synchronous 25% / Asynchronous 75%",
                "Asynchronous 100%",
              ]}
              initialValue={compass.communication}
            />

            <RadioFieldset
              title="GOVERNANCE"
              name="governance"
              options={[
                "Decisions are just told",
                "Decisions are explained",
                "Stakeholders  are consulted before decide",
                "Stakeholders  are consulted + transparency on the process",
                "Open Governance",
              ]}
              initialValue={compass.governance}
            />
            <button type="submit">Save</button>
          </form>

          <button onClick={onCopyURLClicked}>copy URL image</button>
          <code>{createURL(user.id, false)}</code>
          <div>
            <img src={url} alt="chart" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompassForm;
