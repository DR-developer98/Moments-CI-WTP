import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../../src/styles/MoreDropdown.module.css";

// 16. Deze component is uit Bootstrap genomen
// 16a. we verwijderen de "children"-prop en het href= attribuut, daar we deze niet nodig hebben
// We veranderen de eerste <a></a> anchor-tag in een <i> tag

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <i
    className="fas fa-ellipsis-v"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

// 16b. We exporteren het dropdownmenu: in het return-statement
// plakken we het dropdown-menu uit de functie hieronder (deze hebben we
// overgenomen uit Bootstrap en nu verwijderd)
// 16c. Dropdown.Toggle as={ThreeDots}
// 16d. Dropdown.Menu --> het "as={}" verwijderd als attribuut
// Voor stap 16e. kijk in Post.js ---> {is_owner && postPage && <MoreDropdown/>}

// 16j. We geven de handleEdit-functie uit Post.js (doorgegeven als prop in <MoreDropdown handleEdit={handleEdit}) door
// aan de MoreDropdown-component. We destructureren de props gelijk tussen de haakjes
// Voor stap 16k. kijk hieronder bij Dropdown.Item
export const MoreDropdown = ({handleEdit, handleDelete}) => {
  return (
    <Dropdown className="ml-auto" drop="left">
      <Dropdown.Toggle as={ThreeDots} />

      <Dropdown.Menu className="text-center" popperConfig={{ strategy: "fixed" }}>
        <Dropdown.Item
          className={styles.DropdownItem}
          // 16k. handleEdit
          // voor stap 16l. (handleDelete-functie) kijk weer in Post.js
          onClick={handleEdit}
          // 16f. om het dropdownmenu leesbaar te maken voor screenreaders
          // voegen we dit aria-label attribuut
          // Voor stap 16g. ga naar Post.js
          aria-label="edit"
        >
          <i className="fas fa-edit" />
        </Dropdown.Item>
        <Dropdown.Item
          className={styles.DropdownItem}
          onClick={() => {handleDelete}}
          aria-label="delete"
        >
          <i className="fas fa-trash-alt" />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
