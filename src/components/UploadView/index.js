import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { faCircleExclamation, faFile, faFilePdf, faFileWord } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BASE_API_URL } from "../../constant";
import { getParagraphs, loadPdf } from "../../helper";
import education from './education.png'
import Loading from "../Loading";


const UploadView = () => {

    const [checkFile, setCheckFile] = useState(null);
    const [referenceFile, setReferenceFile] = useState(null);
    const [checkFileIcon, setCheckFileIcon] = useState();
    const [referenceFileIcon, setReferenceFileIcon] = useState();

    const [checkText, setCheckText] = useState('');
    const [referenceText, setReferenceText] = useState('');

    const [currentStatus, setCurrentStatus] = useState('upload');

    const [similarity, setSimilarity] = useState();
    const [plagiarismResult, setPlagiarismResult] = useState();

    useEffect(() => {
        if (checkFile == null) {
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target.result;
            const paragraphs = getParagraphs(content).join(' ');

            setCheckText(paragraphs);
        };

        reader.onerror = (err) => console.error(err);

        reader.readAsBinaryString(checkFile);
    }, [checkFile])

    useEffect(() => {
        if (referenceFile == null) {
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target.result;
            const paragraphs = getParagraphs(content).join(' ');

            setReferenceText(paragraphs);
        };

        reader.onerror = (err) => console.error(err);

        reader.readAsBinaryString(referenceFile);
    }, [referenceFile])

    const submitCheckFile = (e) => {
        const file = e.target.files[0];

        setCheckFile(file);
        const tokens = file.name.split('.');

        if (tokens[tokens.length - 1] == 'pdf') {
            setCheckFileIcon(faFilePdf)
        } else {
            setCheckFileIcon(faFileWord)
        }
    }

    const openCheckFile = () => {
        document.getElementById('check-file').click();
    }

    const onCheckDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;

        for (let i = 0; i < files.length; i++) {
            const tokens = files[i].name.split(".");
            const extension = tokens[tokens.length - 1];

            if (extension == "docx") {
                setCheckFile(files[i]);
                setCheckFileIcon(faFileWord)
                break;
            }
        };

        onCheckDragLeave(e);
    }

    const onCheckDragOver = (e) => {
        e.preventDefault();
        e.target.classList.add("bg-slate-100");
    }

    const onCheckDragLeave = (e) => {
        e.target.classList.remove("bg-slate-100");
    }

    const submitReferenceFile = (e) => {
        const file = e.target.files[0];

        setReferenceFile(file);
        const tokens = file.name.split('.');

        if (tokens[tokens.length - 1] == 'pdf') {
            setReferenceFileIcon(faFilePdf)
        } else {
            setReferenceFileIcon(faFileWord)
        }
    }

    const openReferenceFile = () => {
        document.getElementById('reference-file').click();
    }

    const onReferenceDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;

        for (let i = 0; i < files.length; i++) {
            const tokens = files[i].name.split(".");
            const extension = tokens[tokens.length - 1];

            if (extension == "docx") {
                setReferenceFile(files[i]);
                setReferenceFileIcon(faFileWord)
                break;
            }
        };

        onReferenceDragLeave(e);
    }

    const onReferenceDragOver = (e) => {
        e.preventDefault();
        e.target.classList.add("bg-slate-100");
    }

    const onReferenceDragLeave = (e) => {
        e.preventDefault();
        e.target.classList.remove("bg-slate-100");
    }

    const toggleErrorModal = () => {
        document.getElementById('error-modal').classList.toggle('hidden');
    }

    const toggleLoadingModal = () => {
        document.getElementById('loading-modal').classList.toggle('hidden');
    }

    const process = async () => {
        if (checkFile == null || referenceFile == null) {
            toggleErrorModal();
        } else {
            toggleLoadingModal();

            const url = BASE_API_URL + '/api/check_plagiarism';

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Type': 'application/json'
                },
                body: JSON.stringify({
                    checkText: checkText,
                    referenceText: referenceText
                })
            })

            const data = await res.json();

            console.log(data);

            if (data.result == 'success') {
                const tokens = data.data.split("%%");

                const newSimilarity = Math.round(parseFloat(tokens[tokens.length - 3]) * 100);
                const newPlagiarismResult = tokens[tokens.length - 2];

                setSimilarity(newSimilarity);
                setPlagiarismResult(newPlagiarismResult)

                toggleLoadingModal();
                setCurrentStatus('finish');
            }
        }
    }

    const uploadAgain = () => {
        setCurrentStatus('upload');
    }

    return (
        <div className="w-full h-full flex flex-col relative">
            <Navbar />

            <div className="grow w-full h-full flex flex-col items-center justify-center px-10 py-12 md:px-20 lg:px-32 z-10">
                {
                    currentStatus == 'upload' ?
                        <>
                            <div className="w-full grow grid grid-cols-1 space-y-6 md:space-y-0 md:grid-cols-2">
                                <div className="col px-6 flex flex-col">
                                    <div className="text-2xl font-medium mb-5 md:mb-12 text-center">Upload file here</div>

                                    <div className="grow flex flex-col px-6 py-4 border border-slate-300 shadow-md rounded-lg flex flex-col items-center justify-center" onDrop={e => onCheckDrop(e)} onDragOver={e => onCheckDragOver(e)} onDragLeave={e => onCheckDragLeave(e)}>
                                        {
                                            checkFile == null ?
                                                <FontAwesomeIcon icon={faFile} className="text-5xl text-slate-600" />
                                                :
                                                <>
                                                    <FontAwesomeIcon icon={checkFileIcon} className="text-5xl text-slate-600" />
                                                    <div className="text-red-500">{checkFile.name}</div>
                                                </>
                                        }

                                        <div className="font-medium mt-4 text-xl">Drag your files here </div>
                                        <div className="text-sm">(.docx)</div>
                                        <button className="btn btn-blue mt-5" onClick={openCheckFile}>Import files</button>

                                        <input id="check-file" type="file" className="hidden" accept=".docx" onChange={(e) => submitCheckFile(e)} />
                                    </div>
                                </div>

                                <div className="col px-6 flex flex-col">
                                    <div className="text-2xl font-medium mb-5 md:mb-12 text-center">
                                        Upload reference here
                                    </div>

                                    <div className="grow flex flex-col px-6 py-4 border border-slate-300 shadow-md rounded-lg flex flex-col items-center justify-center" onDrop={e => onReferenceDrop(e)} onDragOver={e => onReferenceDragOver(e)} onDragLeave={e => onReferenceDragLeave(e)}>
                                        {
                                            referenceFile == null ?
                                                <FontAwesomeIcon icon={faFile} className="text-5xl text-slate-600" />
                                                :
                                                <>
                                                    <FontAwesomeIcon icon={referenceFileIcon} className="text-5xl text-slate-600" />
                                                    <div className="text-red-500">{referenceFile.name}</div>
                                                </>
                                        }
                                        <div className="font-medium mt-4 text-xl">Drag your files here </div>
                                        <div className="text-sm">(.docx)</div>
                                        <button className="btn btn-blue mt-5" onClick={openReferenceFile}>Import files</button>

                                        <input id="reference-file" type="file" className="hidden" accept=".docx" onChange={(e) => submitReferenceFile(e)} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center mt-8">
                                <div>
                                    <button className='btn btn-green px-10 mt-4' onClick={process}>Process</button>
                                </div>
                            </div>
                        </>
                        :
                        <ResultView similarity={similarity} plagiarismResult={plagiarismResult} uploadAgain={uploadAgain} />
                }
            </div>

            <div id='error-modal' className="hidden fixed top-0 left-0 w-full h-full z-20 bg-slate-50/60 flex items-center justify-center">
                <div className="w-96 h-48 bg-slate-50 border border-gray-500 rounded shadow-lg flex flex-col justify-center items-center">
                    <FontAwesomeIcon icon={faCircleExclamation} className="text-red-500 text-4xl" />
                    <div className="mt-5">Check File or Reference File cannot be empty</div>
                    <div className="mt-5">
                        <button className="btn btn-blue" onClick={toggleErrorModal}>Cancel</button>
                    </div>
                </div>
            </div>

            <div id='loading-modal' className="hidden fixed top-0 left-0 w-full h-full z-20 bg-slate-50/60 flex items-center justify-center">
                <Loading />
            </div>
        </div>
    )
}

const ResultView = ({ similarity, plagiarismResult, uploadAgain }) => {

    return (
        <div className="w-full grow flex flex-col items-center justify-center">
            <div className="flex items-center">
                <div className="flex flex-col items-center">
                    <div className={`${plagiarismResult.toUpperCase() == 'FALSE' ? 'text-green-700' : 'text-red-700'} text-6xl font-bold italic`}>{plagiarismResult.toUpperCase() == 'FALSE' ? 'Pass' : 'Not Pass'}</div>
                    <img className="w-72 mt-5" src={education} />
                </div>

                <div className={`ms-20 flex flex-col items-center justify-center w-52 h-52 border border-8 rounded-full ${plagiarismResult.toUpperCase() == 'FALSE' ? 'border-green-700' : 'border-red-700'}`}>
                    <div className={`text-4xl font-bold ${plagiarismResult.toUpperCase() == 'FALSE' ? 'text-green-800' : 'text-red-800'}`}>{similarity}%</div>
                    <div className="mt-4 text-xl">Plagiarism</div>
                </div>
            </div>

            <div className="mt-16">
                <button className="btn btn-blue" onClick={uploadAgain}>Upload other files</button>
            </div>
        </div>
    )
}

export default UploadView;
