import React, { Component } from "react";

class Header extends Component {
  render() {
    return (
      <div className="text-center">
        <img
          src="https://cdn.discordapp.com/attachments/1034170524416344181/1034248158311633067/4631.png"
          width="300"
          className="img-thumbnail"
          style={{ marginTop: "20px" }}
        />
        <hr />
        <h5>
          <i>presents</i>
        </h5>
        <h1>Chickatree</h1>
      </div>
    );
  }
}

export default Header;
