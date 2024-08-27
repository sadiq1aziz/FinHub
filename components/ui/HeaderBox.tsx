import React from "react";
// in ts, we use components that conform to an interface
// the interface defines the instance that we want to make
// the params, type are all stated alongside mandatory/optional requirement
const HeaderBox = ({ type, title, user, subtext }: HeaderBoxProps) => {
  return (
    <section className="header-box">
      <h1 className="header-box-title">
        {title}
        {type === "greeting" && (
          <span className="text-bankGradient">&nbsp;{user}</span>
        )}
      </h1>

      <p className="header-box-subtext">{subtext}</p>
    </section>
  );
};

export default HeaderBox;
