// COSTANTI
const c = {
    TO_BE_STARTED : "TO_BE_STARTED",
    WAITING : "WAITING",        // quando i figli stanno girando il padre è in WAITING
    DISCARDED : "DISCARDED",    // quando in una condizione un nodo si mette in TO_BE_STARTED e l'altro in DISCARDED
    RUNNING : "RUNNING",
    COMPUTE_RESULT : "COMPUTE_RESULT",
    COMPLETED : "COMPLETED"
};

export default c