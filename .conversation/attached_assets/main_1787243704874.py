from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routes.contact import router as contact_router


app = FastAPI(
    title="Samudra Kar Portfolio API",
    description="Backend API for Samudra Kar's portfolio website.",
    version="1.0.0",
)


# ---------------------------------------------------------------
# CORS
# ---------------------------------------------------------------

ALLOWED_ORIGINS = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",

    "http://localhost:3000",
    "http://127.0.0.1:3000",

    # Add your deployed frontend URL here later.
    # "https://yourdomain.com",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------
# Global error handler
# ---------------------------------------------------------------

@app.exception_handler(Exception)
async def generic_exception_handler(
    request: Request,
    exc: Exception
):
    return JSONResponse(
        status_code=500,
        content={
            "message": "Something went wrong. Please try again later."
        },
    )


# ---------------------------------------------------------------
# Routes
# ---------------------------------------------------------------

@app.get("/")
async def read_root():
    return {
        "message": "Samudra Kar Portfolio API is running!"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "ok"
    }


# Contact API
app.include_router(
    contact_router,
    prefix="/api",
    tags=["Contact"],
)
