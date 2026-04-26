import "./BenchReportInfo.css";

export default function BenchReportInfo({ open, onClose }){

    if (!open){
        return null;
    }

    return (
        <div className="info-overlay"> 
            <div className="info-modal-br">
                <div>
                   <button className="info-close" onClick={onClose}>✕</button>
                    <h2> BenchReport Info </h2>
                    <p> BenchReport helps you compare your CPUs and GPUs with clear scoring, detailed specs,
                        all with an easy UI for quick hardware comparisons </p>

                    <div className="info-section" >
                        <h3> Where to Start </h3>
                        <p> Begin by visiting the <strong> CPU and GPU </strong>pages, then select the processors
                            and graphics cards you want to evaluate.
                        </p>
                        <p> Each selection automatically updates your comparison list, making it easy 
                            to build a custom benchmark comparison.
                        
                        </p>
                        <div class="info-section"> <h3>How Comparisons Work</h3> 
                        <p> BenchReport uses a unified scoring model to evaluate performance 
                            across different hardware generations. Scores reflect real‑world workloads, 
                            diminishing returns, and architectural differences. </p> 
                        
                        <p> You can compare multiple CPUs and GPUs side‑by‑side to see strengths, 
                            weaknesses, and overall value. </p> 
                        </div> 
                        <div class="info-section"> 
                            <h3>Baseline Mode</h3> 
                            <p> Want to compare everything against a specific build? 
                                Use <strong> Baseline Mode </strong>in settings to lock in a reference CPU/GPU and measure 
                                all other hardware relative to it. 
                                <br/> <strong> Note:</strong> baseline settings works well if you adjust the weights as well!</p> 
                                
                        </div> 
                        
                        <div class="info-section"> 
                            <h3>Report</h3> 
                                <p> Once your selections are ready, head to the 
                                <strong> Report</strong> page. You'll get a clean, 
                                printable summary of all chosen hardware, including scores, specs, and recommendations. 
                                Then proceed to the <strong> Compare Page</strong> for the customizable comparison and generate a final report</p> 
                        </div> 
                        <div class="info-section"> 
                            <h3>Guest Mode</h3> 
                            <p> Not logged in? No problem. <strong> Guest Mode </strong> lets you explore the full app
                                 without creating an account. Your data resets when you leave. 
                                 </p> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}