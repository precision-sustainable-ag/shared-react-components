import React, { useEffect, useState } from 'react';
import questions from './data/questions';
import {
    Box,
    Card,
    CardContent,
    Stack,
    Typography,
    Divider,
    Link,
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { styles } from './styles/landingStyles';
import PSAButton from '../Button';
import PSAAccordion from '../Accordion';
import PSATheme from '../Theme';
import { createTheme } from '@mui/material';
import { deepmerge } from '@mui/utils';

const theme = createTheme(
  deepmerge(PSATheme,
    {
      palette: {
        primary: {
          main: '#598444',
          second: '#466734',
        },
        secondary: {
          main: '#1976d2',
          second: '#115293',
        },
        red: {
          main: '#d32f2f',
          second: '#b71c1c',
        },
        grey: {
          main: '#bdbdbd',
        },
        white: {
          main: '#ffffff',
        },
        black: {
          main: '#000000',
        },
        transparent: {
          main: '#00000000',
        },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
    }));

export const PSAWizard = ({ }) => {
    const [showQuestionnaire, setShowQuestionnaire] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [noResultFlag, setNoResultFlag] = useState(false);
    const [allResults, setAllResults] = useState([]);
    const [multipleResultFlag, setMultipleResultFlag] = useState(false);

    const appDetails = {
        vegspec: { text: "Vegspec App", url: "https://vegspec.org", reason: "If you want solutions based on NRCS conservation practices" },
        selector: { text: "Cover Crop Selector App", url: "https://covercrop-selector.org", reason: "If you want help selecting a species for planting" },
        seedcalc: { text: "Seed Rate Calculator App", url: "https://covercrop-seedcalc.org/", reason: "If you want help choosing a seeding rate for your cover crops" },
        ncalc: { text: "Nitrogen Calculator App", url: "https://covercrop-ncalc.org", reason: "If you want an extimate of the nitrogen released from your cover crops" },
        econ: { text: "Cover Crop Economic App", url: "https://covercrop-econ.org", reason: "If you want to learn about your cover crops economics" },
    };

    const handleStart = () => setShowQuestionnaire(true);

    useEffect(() => {
        handleFinish();
    }, [answers]);

    const handleAnswer = (answer) => {
        setAnswers(prev => {
            // Toggle answer if clicking the same option again
            const currentAnswer = prev[currentQuestionIndex];
            const newAnswer = currentAnswer === answer ? undefined : answer;

            return {
                ...prev,
                [currentQuestionIndex]: newAnswer
            };
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            return;
        }
        setShowQuestionnaire(false);
    };

    const resetQuestionnaire = () => {
        setShowQuestionnaire(false);
        setCurrentQuestionIndex(-1);
        setAnswers({});
        setShowResult(false);
    };

    // Result Logic
    const calculateResult = () => {
        const a = answers;
        const resultSet = new Set();
        const afterPrioritizedSet = new Set();

        setNoResultFlag(false);
        setMultipleResultFlag(false);

        if (a[0] === 'yes') resultSet.add('vegspec');
        if (a[1] === 'no') resultSet.add('vegspec');
        if (a[2] === 'yes') resultSet.add('selector');
        if (a[3] === 'yes') resultSet.add('econ');
        if (a[4] === 'yes') resultSet.add('ncalc');
        if (a[5] === 'yes') resultSet.add('seedcalc');

        const prioritizedOrder = ['vegspec', 'selector', 'econ', 'ncalc', 'seedcalc'];

        let prioritizedApp = null;
        let prioritizedIndex = -1;
        for (let i = 0; i < prioritizedOrder.length; i++) {
            if (resultSet.has(prioritizedOrder[i])) {
                prioritizedApp = prioritizedOrder[i];
                prioritizedIndex = i;
                break;
            }
        }

        if (!prioritizedApp) {
            setNoResultFlag(true);
            setMultipleResultFlag(true);
            return {
                prioritized: null,
                all: prioritizedOrder,
                display: {
                    text: "",
                    url: "#"
                }
            };
        }
        else {
            setMultipleResultFlag(true);
            for (let i = 0; i < prioritizedOrder.length; i++)
                afterPrioritizedSet.add(prioritizedOrder[i]);
        }

        return {
            prioritized: prioritizedApp,
            all: Array.from(afterPrioritizedSet),
            display: appDetails[prioritizedApp]
        };
    };

    const handleFinish = () => {
        const resultObj = calculateResult();
        setResult(resultObj.display);
        setAllResults(resultObj.all.filter(app => app !== resultObj.prioritized));
        if (resultObj.prioritized || currentQuestionIndex === questions.length - 1) {
            setShowResult(true);
        }
        else {
            handleNext();
        }
    };

    return (
        <Box {...styles.boxBackground}>
            <Box {...styles.box}>
                {!showQuestionnaire && !showResult && (
                    <Stack {...styles.welcomeStack()}>
                        <Typography {...styles.title}>Welcome to Wizard Application</Typography>
                        <Divider sx={{ width: '100%' }} />
                        <Box sx={styles.descriptionBox}>
                            <Typography {...styles.subtitle}>
                                Find the Perfect DST App for Your Needs
                            </Typography>
                            <Typography {...styles.bodyText}>
                                DST Wizard helps you discover the best application based on your
                                preferences and requirements. Answer a few simple questions and
                                we'll recommend the perfect DST app solution for you.
                            </Typography>
                        </Box>
                        <PSAButton
                            variant="contained"
                            onClick={handleStart}
                            buttonType=""
                            sx={{
                                background: theme.palette.primary.main,
                                "&:hover": {
                                    background: theme.palette.primary.second,
                                },
                            }}
                            title={(
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    Get Started
                                </Typography>
                            )}
                        />
                    </Stack>
                )}

                {showQuestionnaire && !showResult && (
                    <Card {...styles.questionCard}>
                        <CardContent>
                            <Typography {...styles.questionText}>
                                {questions[currentQuestionIndex].text}
                            </Typography>

                            <Stack {...styles.answerStack()}>
                                <PSAButton
                                    variant={answers[currentQuestionIndex] === 'yes' ? "contained" : "outlined"}
                                    onClick={() => handleAnswer('yes')}
                                    startIcon={<CheckCircleIcon color={answers[currentQuestionIndex] === 'yes' ? "" : theme.palette.secondary.main} />}
                                    buttonType="Yes"
                                    selected={answers[currentQuestionIndex] === 'yes'}
                                    title={(
                                        <Typography variant="body2" color={answers[currentQuestionIndex] === 'yes' ? "" : theme.palette.secondary.main} sx={{ fontWeight: 'bold' }}>
                                            Yes
                                        </Typography>
                                    )}
                                />
                                <PSAButton
                                    variant={answers[currentQuestionIndex] === 'no' ? "contained" : "outlined"}
                                    onClick={() => handleAnswer('no')}
                                    startIcon={<CancelIcon sx={{ color: answers[currentQuestionIndex] === 'no' ? "" : theme.palette.red.main }} />}
                                    buttonType="No"
                                    selected={answers[currentQuestionIndex] === 'no'}
                                    title={(
                                        <Typography variant="body2" color={answers[currentQuestionIndex] === 'no' ? "white" : theme.palette.red.main} sx={{ fontWeight: 'bold' }}>
                                            No
                                        </Typography>
                                    )}
                                />
                            </Stack>
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                                <PSAButton
                                    variant="contained"
                                    title="Back"
                                    onClick={handleBack}
                                    startIcon={<ArrowBackIcon />}
                                    buttonType="Back"
                                />
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {showResult && (
                    <Card {...styles.resultCard}>
                        <CardContent>
                            <Stack {...styles.resultStack()}>
                                <Typography {...styles.resultTitle}>
                                    Your Recommended DST App
                                </Typography>
                                <Divider sx={{ width: '100%' }} />
                                {noResultFlag && (
                                    <Typography {...styles.bodyText} sx={{ marginTop: 2 }}>
                                        Based on your answers:
                                    </Typography>
                                )}
                                {!noResultFlag && (
                                    <Typography {...styles.bodyText}>
                                        Based on your answers, we recommend:
                                    </Typography>
                                )}
                                {result.text && (<Link href={result.url} target="_blank" sx={{
                                    color: theme.palette.secondary.main,
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                        color: theme.palette.secondary.second,
                                    },
                                }}>
                                    <Typography {...styles.resultName} sx={{
                                        cursor: 'pointer', color: theme.palette.primary.main, '&:hover': {
                                            color: theme.palette.secondary.second,
                                        },
                                    }}>
                                        {result.text}
                                    </Typography>
                                </Link>)}

                                {!result.text && (
                                    <Typography {...styles.resultName} sx={{ color: theme.palette.primary.main }}>
                                        No any app matches your criteria
                                    </Typography>
                                )}

                                {!noResultFlag && (
                                    <Typography {...styles.bodyText}>
                                        This app best matches your needs and preferences.
                                    </Typography>
                                )}
                                {multipleResultFlag && allResults.length > 0 && (
                                    <>
                                        <Divider sx={{ width: '100%', marginY: 2 }} />
                                        {result.text && (<Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 10 }}>
                                            The other apps we offer are:
                                        </Typography>)}
                                        {!result.text && (<Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 10 }}>
                                            The apps we offer are:
                                        </Typography>)}
                                        <PSAAccordion
                                            defaultExpanded
                                            summaryContent={
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        jutifyContent: "center",
                                                        alignItems: "center",
                                                        color: "additional.greydark",
                                                    }}
                                                >
                                                    {result.text && (<Typography>Other Apps</Typography>)}
                                                    {!result.text && (<Typography>DST Apps</Typography>)}
                                                </Box>
                                            }
                                            detailsContent={
                                                <Box>
                                                    {allResults.map(app => {
                                                        const appData = appDetails[app];
                                                        return (<Stack direction="row" spacing={1} sx={{ marginTop: 1, width: '100%' }}>
                                                            <Box sx={{ width: 170 }}>
                                                                <Link key={app} href={appData.url} target="_blank" underline="hover">
                                                                    <Typography variant="body2" sx={{
                                                                        color: theme.palette.primary.main, '&:hover': {
                                                                            color: theme.palette.secondary.second,
                                                                        }, cursor: 'pointer'
                                                                    }}>
                                                                        {appData.text}
                                                                    </Typography>
                                                                </Link>
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="body2" sx={{ color: 'text.black' }}>
                                                                    {appData.reason}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>)
                                                    })}
                                                </Box>
                                            }
                                        >
                                        </PSAAccordion>
                                    </>
                                )}
                                <PSAButton
                                    variant="contained"
                                    onClick={resetQuestionnaire}
                                    buttonType=""
                                    sx={{
                                        background: theme.palette.primary.main,
                                        "&:hover": {
                                            background: theme.palette.primary.second,
                                        },
                                    }}
                                    title={(
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            Start Over
                                        </Typography>
                                    )}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </Box>
    );
};