export const sx = {
  overlay: {
    position: 'fixed',
    maxWidth: 800,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 2,
    zIndex: 1300,
    transform: {
      xs: 'scale(0.92)',
      sm: 'scale(0.96)',
      md: 'scale(1)',
    },
    transformOrigin: 'center top',
  },

  modal: {
    fontFamily: 'Source Sans Pro Web, Helvetica Neue, Helvetica, Roboto, Arial, sans-serif',
    maxWidth: 1050,
    minHeight: 450,
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
    display: 'flex',
    boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
  },

  imageWrapper: {
    width: '37%',
    minWidth: 200,
    display: { xs: 'none', sm: 'block' },
  },

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    px: 2,
    py: 4,
    position: 'relative',
  },

  close: {
    position: 'absolute',
    top: 8,
    right: 8,
    color: '#222',
  },

  inner: {
    maxWidth: 'calc(100% - 24px)',
  },

  header: {
    fontSize: 24,
    lineHeight: 1.2,
    fontWeight: 'bold',
    color: '#222',
    mb: 3,
  },

  body: {
    fontSize: 18,
    lineHeight: 1.7,
    color: '#333',
    mb: 4,
  },

  optionButton: {
    backgroundColor: '#f5f5f5',
    color: '#333',
    borderRadius: 2,
    px: 2.5,
    py: 1.2,
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },

  buttonBase: {
    borderRadius: 1,
    minWidth: 140,
    width: '50%',
    px: 3,
    py: 1.2,
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '1rem',
    boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
    display: 'flex',
    gap: 1.5,
    justifyContent: 'center',
  },

  backButton: {
    backgroundColor: 'white',
    color: '#333',
    '&:hover': {
      backgroundColor: '#ddd',
    },
    justifyContent: 'flex-start',
    pl: 2,
  },

  nextButton: {
    backgroundColor: '#27739E',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#115293',
    },
    justifyContent: 'flex-end',
    pr: 2,
  },

  arrowIcon: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 20,
  },

  arrowBackIcon: {
    left: 12,
  },

  arrowNextIcon: {
    right: 12,
  },

  fullOptionButton: {
    width: '100%',
    justifyContent: 'left',
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    borderRadius: 2,
    py: 1.5,
    px: 3,
    backgroundColor: '#f5f5f5',
    color: '#444',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },

  selectedButton: {
    backgroundColor: '#27739E',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#115293',
    },
  },

  resultWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    mt: 2,
  },

  resultLead: {
    fontSize: 24,
    lineHeight: 1.2,
    fontWeight: 700,
    color: '#2f2f2f',
    mb: 2,
  },

  resultTool: {
    fontSize: 34,
    lineHeight: 1.1,
    fontWeight: 700,
    color: '#5b8441',
    textDecoration: 'none',
    mb: 2,
  },

  resultBody: {
    fontSize: 16,
    lineHeight: 1.6,
    color: '#333',
    maxWidth: 620,
    mb: 3,
  },

  resultButtons: {
    display: 'flex',
    gap: 2,
    justifyContent: 'center',
    flexWrap: 'wrap',
    mb: 5,
  },

  primaryCta: {
    backgroundColor: '#27739E',
    color: '#fff',
    minWidth: 140,
    px: 3,
    py: 1.1,
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '1rem',
    borderRadius: 1,
    '&:hover': {
      backgroundColor: '#115293',
    },
  },

  secondaryCta: {
    backgroundColor: '#fff',
    color: '#555',
    minWidth: 140,
    px: 3,
    py: 1.1,
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '1rem',
    borderRadius: 1,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#f3f3f3',
    },
  },

  otherToolsBox: {
    backgroundColor: '#f3f3f3',
    borderRadius: 4,
    p: 3,
  },

  otherToolsHeader: {
    fontSize: 22,
    fontWeight: 700,
    color: '#555',
    mb: 2,
    textAlign: 'left',
  },

  otherToolRow: {
    display: 'grid',
    gridTemplateColumns: '190px 1fr',
    columnGap: 2,
    rowGap: 1.5,
    alignItems: 'start',
    mb: 1.5,
  },

  otherToolLink: {
    color: '#6d8e57',
    textDecorationColor: '#6d8e57',
    fontSize: 16,
    textAlign: 'left',
  },

  otherToolText: {
    fontSize: 16,
    color: '#222',
    textAlign: 'left',
  },
};
