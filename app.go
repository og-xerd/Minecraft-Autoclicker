package main

import (
	"context"
	"os"
)

type App struct {
	ctx context.Context

	AutoClicker *AutoClicker
}

func NewApp() *App {
	return &App{}
}

func (a *App) shutdown(ctx context.Context) {
	os.Remove(a.AutoClicker.SoundFile.Load().(string))
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	a.AutoClicker = NewAutoClicker()
	a.AutoClicker.Run()
}
