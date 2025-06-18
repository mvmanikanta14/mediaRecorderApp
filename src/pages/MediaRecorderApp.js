import React, { useRef, useState, useEffect } from 'react';

const MediaRecorderApp = () => {
    const [recordingType, setRecordingType] = useState('audio');
    const [recording, setRecording] = useState(false);
    const [paused, setPaused] = useState(false);
    const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
    const [mediaBlob, setMediaBlob] = useState(null);
    const [recordings, setRecordings] = useState(() => JSON.parse(localStorage.getItem('recordings') || '[]'));
    const [error, setError] = useState(null);
    const [timer, setTimer] = useState(0);
    const timerRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const videoRef = useRef(null);
    const chunks = useRef([]);

    useEffect(() => {
        localStorage.setItem('recordings', JSON.stringify(recordings));
    }, [recordings]);

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        clearInterval(timerRef.current);
    };

    const startRecording = async () => {
        setError(null);
        const constraints = recordingType === 'audio' ? { audio: true } : { audio: true, video: true };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            mediaStreamRef.current = stream;

            if (videoRef.current && recordingType === 'video') {
                videoRef.current.srcObject = stream;
            }

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            chunks.current = [];
            mediaRecorder.ondataavailable = (e) => chunks.current.push(e.data);

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks.current, {
                    type: recordingType === 'audio' ? 'audio/webm' : 'video/webm',
                });

                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64Data = reader.result;
                    const newRecording = {
                        data: base64Data,
                        type: recordingType,
                        timestamp: new Date().toISOString(),
                        duration: timer,
                    };
                    setMediaBlob(blob);
                    setMediaBlobUrl(base64Data);
                    setRecordings(prev => [...prev, newRecording]);
                };

                reader.readAsDataURL(blob);
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setRecording(true);
            setPaused(false);
            setTimer(0);
            startTimer();
        } catch (err) {
            setError('Permission denied or device not available.');
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
        setPaused(false);
        stopTimer();
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.pause();
            setPaused(true);
            stopTimer();
        }
    };

    const resumeRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
            mediaRecorderRef.current.resume();
            setPaused(false);
            startTimer();
        }
    };

    const downloadRecording = (dataUrl, type, index) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `recording_${index + 1}.${type === 'audio' ? 'webm' : 'webm'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="">
            <h1 className=""> Media Recorder Studio</h1>

            <div className="d-flex justify-content-center my-2 align-items-center">
                <div className="mx-2 d-flex justify-content-center my-2 align-items-center">
                    <div>  <label className="mx-2">Select Mode:</label> </div>
                    <div> <select
                        value={recordingType}
                        onChange={(e) => setRecordingType(e.target.value)}
                        disabled={recording}
                        className="form-control"
                    >
                        <option value="audio">Audio</option>
                        <option value="video">Video</option>
                    </select> </div>
                </div>

                <div className="">
                    {!recording ? (
                        <button
                            onClick={startRecording}
                            className="btn-sm btn-primary btn mr-3"
                        >
                             Start
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={stopRecording}
                                className="btn-sm btn-danger btn mr-3"
                            >
                                ⏹ Stop
                            </button>
                            {!paused ? (
                                <button
                                    onClick={pauseRecording}
                                    className="btn-sm btn-secondary btn mr-3"
                                >
                                    ⏸ Pause
                                </button>
                            ) : (
                                <button
                                    onClick={resumeRecording}
                                    className="btn-sm btn-success btn mr-3"
                                >
                                    ▶ Resume
                                </button>
                            )}
                        </>
                    )}
                    {recording && (
                        <span className="btn-sm btn-info btn">
                            ⏱ {formatTime(timer)}
                        </span>
                    )}
                </div>
            </div>

            {recordingType === 'video' && recording && (
                <video ref={videoRef} autoPlay className="w-full rounded-lg shadow-md mb-6 border" />
            )}

            {mediaBlobUrl && (
                <div className="d-flex justify-content-center my-2 align-items-center pr-2">
                    <h2 className="mr-3">Preview</h2>
                    {recordingType === 'audio' ? (
                        <audio src={mediaBlobUrl} controls className="w-full rounded" />
                    ) : (
                        <video src={mediaBlobUrl} controls className="w-full rounded" />
                    )}
                    <button
                        onClick={() => downloadRecording(mediaBlobUrl, recordingType, 0)}
                        className="btn btn-primary"
                    >
                       Download
                    </button>
                </div>
            )}

            <div className="mt-10">
                {recordings.length === 0 ? (
                    <p className="text-gray-600">No recordings yet.</p>
                ) : (
                    <div className="">
                        <div className="custom-card">
                            <div className="custom-header"> Past Recordings</div>
                            <div className="custom-table-wrapper">
                                <table className="table-bordered">
                                    <thead>
                                        <tr>
                                            <th>S No</th>
                                            <th>Timestamp</th>
                                            <th>Type</th>
                                            <th>Duration</th>
                                            <th>Preview</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recordings.map((rec, idx) => (
                                            <tr key={idx}>
                                                <td>{idx + 1}</td>
                                                <td>{new Date(rec.timestamp).toLocaleString()}</td>
                                                <td>{rec.type}</td>
                                                <td>{formatTime(rec.duration || 0)}</td>
                                                <td>
                                                    {rec.type === 'audio' ? (
                                                        <audio src={rec.data} controls />
                                                    ) : (
                                                        <video src={rec.data} controls width="120" />
                                                    )}
                                                </td>
                                                <td>
                                                    <button onClick={() => downloadRecording(rec.data, rec.type, idx)} className="custom-download-btn">
                                                        ⬇ Download
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaRecorderApp;