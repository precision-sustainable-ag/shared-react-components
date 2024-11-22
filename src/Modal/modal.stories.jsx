import React, { useState } from "react";
import { PSAModal } from "./modal";
import { Button } from "@mui/material";

const meta = {
  title: "Modal",
  component: PSAModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `A custom modal component that wraps MUI's \`Modal\` component. It accepts all the props from MUI's Modal and can be customized as needed.`,
      },
    },
  },
};

export default meta;

export const Default = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const modalContent = (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        margin: "auto",
        marginTop: "15%",
        maxWidth: "500px",
        borderRadius: "8px",
        outline: "none",
      }}
    >
      <h2>Modal Title</h2>
      <p>
        This is the content of the modal. You can place any components here.
      </p>
      <Button variant="contained" color="primary" onClick={handleClose}>
        Close Modal
      </Button>
    </div>
  );

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Open Modal
      </Button>
      <PSAModal
        open={open}
        onClose={handleClose}
        modalContent={modalContent}
        closeAfterTransition
        disableEscapeKeyDown={false}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </div>
  );
};
