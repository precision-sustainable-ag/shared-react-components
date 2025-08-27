// Styles for all the components in the application
export const styles = {
    boxBackground: {
        sx: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#fff',
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
        }
    },
    box: {
        sx: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 400,
            width: 800,
            p: 5,
            marginTop: -20,
            marginLeft: 10,
            marginRight: 10,
            backgroundColor: '#fff',
            borderRadius: 3,
        },
        elevation: 3
    },
    questionCard: {
        sx: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 400,
            width: 800,
            p: 2,
            m: -5,
            backgroundColor: 'transparent',
            borderRadius: 3,
        },
    },
    resultCard: {
        sx: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 650,
            width: 800,
            overflowY: 'auto',
            marginX: -5,
            marginTop: 15,
            backgroundColor: '#fff',
            borderRadius: 3,
        },
    },
    logoImage: {
        width: 80,
        height: 80,
        mb: 2
    },
    welcomeStack: () => ({
        alignItems: 'center',
        spacing: 2
    }),
    title: {
        variant: 'h3',
        component: 'h1'
    },
    descriptionBox: {
        textAlign: 'center',
        my: 4
    },
    subtitle: {
        variant: 'h5',
        gutterBottom: true
    },
    bodyText: {
        variant: 'body1',
        color: 'text.secondary',
        paragraph: true
    },
    startButton: {
        variant: 'contained',
        size: 'large',
        mt: 2,
        sx: {
            backgroundColor: ' #598444',
            '&:hover': {
                backgroundColor: ' #3d5b2f'
            }
        }
    },
    questionNumber: {
        variant: 'h6',
        component: 'h3',
        fontWeight: 'bold',
        gutterBottom: true
    },
    questionText: {
        variant: 'h6',
        paragraph: true
    },
    yesButton: (selected) => ({
        variant: selected ? 'contained' : 'outlined',
        color: 'secondary',
        size: 'large',
        sx: {
            bgcolor: selected ? undefined : 'transparent',
            '&:hover': {
                bgcolor: selected ? undefined : 'action.hover'
            }
        }
    }),
    noButton: (selected) => ({
        variant: selected ? 'contained' : 'outlined',
        color: 'error',
        size: 'large',
        sx: {
            bgcolor: selected ? undefined : 'transparent',
            '&:hover': {
                bgcolor: selected ? undefined : 'action.hover'
            }
        }
    }),
    backButton: {
        variant: 'outlined',
    },
    nextButton: {
        variant: 'contained',
        sx: {
            backgroundColor: ' #598444',
            '&:hover': {
                backgroundColor: ' #3d5b2f'
            }
        }
    },
    finishButton: {
        variant: 'contained',
        sx: {
            backgroundColor: ' #598444',
            '&:hover': {
                backgroundColor: ' #3d5b2f'
            }
        }
    },
    answerStack: () => ({
        direction: 'row',
        spacing: 2,
        justifyContent: 'center',
        sx: {
            my: 3
        }
    }),
    navStack: () => ({
        direction: 'row',
        justifyContent: 'space-between',
        sx: {
            mt: 4
        }
    }),
    resultStack: () => ({
        spacing: 3,
        alignItems: 'center',
        height: '100%',
        sx: {
            marginTop: 3,
        }
    }),
    resultTitle: {
        variant: 'h4',
        component: 'h2'
    },
    resultName: {
        variant: 'h3',
        color: 'primary',
        fontWeight: 'bold'
    },
    restartButton: {
        variant: 'contained',
        size: 'large'
    }
};