#!/usr/bin/env python3

from typing import Optional
from fastapi import FastAPI, Request
import logging

PREFIX = '/app/fac/api/'
app = FastAPI(docs_url="/cgi/docs", redoc_url="/cgi/redoc", openapi_url="/cgi/openapi.json")
db = {}

@app.get("/")
@app.get("/cgi")
def read_root():
    return {"msg": "hello world from fastapi"}


@app.get("/app/fac/api/db")
def read_db():
    return db


@app.get("/app/fac/api/login")
def login(channel: str, request: Request):
    ip = request.client.host
    if db.get(ip) is not None and channel in db[ip]:
        return True
    return False


@app.get("/app/fac/api/authorise")
def authorise(channel: str, request: Request):
    ip = request.client.host
    if db.get(ip) is None:
        db[ip] = []
    length_pre = len(db[ip])
    db[ip].append(channel)
    db[ip] = list(dict.fromkeys(db[ip]))
    if length_pre < len(db[ip]):
        return True
    return False


@app.get("/app/fac/api/delete")
def delete(request: Request):
    ip = request.client.host
    if db.pop(ip, None) is not None:
        return True
    return False
