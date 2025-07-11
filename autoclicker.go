package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"math/rand"
	"os"
	"sync/atomic"
	"syscall"
	"time"
	"unsafe"

	"github.com/lxn/win"
)

//go:embed click.wav
var click embed.FS

var (
	user32           = syscall.NewLazyDLL("user32.dll")
	vkKeyScanW       = user32.NewProc("VkKeyScanW")
	getAsyncKeyState = user32.NewProc("GetAsyncKeyState")
	getCursorInfo    = user32.NewProc("GetCursorInfo")
	getClipCursor    = user32.NewProc("GetClipCursor")

	winmm     = syscall.NewLazyDLL("winmm.dll")
	playSound = winmm.NewProc("PlaySoundW")
)

func IsKeyPressed(vk int) bool {
	ret, _, _ := getAsyncKeyState.Call(uintptr(vk))
	return ret&0x8000 != 0
}

const CURSOR_SHOWING = 0x00000001

type POINT struct {
	X, Y int32
}

type CURSORINFO struct {
	CbSize   uint32
	Flags    uint32
	HCursor  syscall.Handle
	PtScreen POINT
}

func GetCursorVisible() bool {
	var ci CURSORINFO
	ci.CbSize = uint32(unsafe.Sizeof(ci))
	getCursorInfo.Call(uintptr(unsafe.Pointer(&ci)))

	if ci.HCursor == 65539 {
		return true
	} else {
		return false
	}
}

func PlaySound(pathPtr *uint16) {
	playSound.Call(
		uintptr(unsafe.Pointer(pathPtr)),
		0,
		uintptr(0x0001|0x00020000),
	)
}

func GetVK(char rune) int16 {
	ret, _, _ := vkKeyScanW.Call(uintptr(char))
	return int16(ret)
}

func GetForegroundWindow() win.HWND {
	return win.GetForegroundWindow()
}

func FindWindow(windowName string) win.HWND {
	windowTitle := syscall.StringToUTF16Ptr(windowName)
	hwnd := win.FindWindow(nil, windowTitle)
	return hwnd
}

type MouseButton struct {
	Enabled atomic.Bool
	Keybind atomic.Int32
	Cps     atomic.Value //[]int
	Toggle  atomic.Bool
}

type AutoClicker struct {
	Active atomic.Bool

	Detention  atomic.Bool
	LeftClick  MouseButton
	RightClick MouseButton

	Hwnd       atomic.Value //win.HWND
	WindowName atomic.Value //string

	SoundFile     atomic.Value
	ClickingSound atomic.Bool
}

func NewAutoClicker() *AutoClicker {
	var windowName, hwnd atomic.Value
	windowName.Store(string(""))
	hwnd.Store(win.HWND(0))

	return &AutoClicker{
		WindowName: windowName,
		Hwnd:       hwnd,
	}
}

func (ac *AutoClicker) AutoClicker() {
	f, err := click.Open("click.wav")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	tmpFile, err := os.CreateTemp("", "sound-*.wav")
	if err != nil {
		log.Fatal(err)
	}
	defer os.Remove(tmpFile.Name())

	ac.SoundFile.Store(tmpFile.Name())

	data, err := fs.ReadFile(click, "click.wav")
	if err != nil {
		panic(err)
	}

	pathPtr, _ := syscall.UTF16PtrFromString(tmpFile.Name())

	tmpFile.Write(data)
	tmpFile.Close()

	var leftDown bool
	var leftEnabled bool

	var rightDown bool
	var rightEnabled bool

	for {
		for ac.Active.Load() && !ac.Detention.Load() {

			if ac.LeftClick.Enabled.Load() {
				key := int(ac.LeftClick.Keybind.Load())
				hwnd := ac.Hwnd.Load().(win.HWND)
				cps := ac.LeftClick.Cps.Load().([]int)
				isToggle := ac.LeftClick.Toggle.Load()
				isDown := IsKeyPressed(key)

				if isToggle {
					if !isDown && leftDown {
						leftEnabled = !leftEnabled
					}

					leftDown = isDown

					if leftEnabled {
						win.SendMessage(hwnd, win.WM_LBUTTONDOWN, 0, 0)
						win.SendMessage(hwnd, win.WM_LBUTTONUP, 0, 0)
						if ac.ClickingSound.Load() {
							PlaySound(pathPtr)
						}

						cps := 1000 / int64(cps[rand.Intn(len(cps))])
						time.Sleep(time.Duration(cps) * time.Millisecond)
					}

				} else {
					if isDown {
						win.SendMessage(hwnd, win.WM_LBUTTONDOWN, 0, 0)
						win.SendMessage(hwnd, win.WM_LBUTTONUP, 0, 0)
						if ac.ClickingSound.Load() {
							PlaySound(pathPtr)
						}

						cps := 1000 / int64(cps[rand.Intn(len(cps))])
						time.Sleep(time.Duration(cps) * time.Millisecond)
					}

				}
			}

			if ac.RightClick.Enabled.Load() {
				key := int(ac.RightClick.Keybind.Load())
				hwnd := ac.Hwnd.Load().(win.HWND)
				cps := ac.RightClick.Cps.Load().([]int)
				isToggle := ac.RightClick.Toggle.Load()
				isDown := IsKeyPressed(key)

				if isToggle {
					if !isDown && rightDown {
						rightEnabled = !rightEnabled
					}

					rightDown = isDown

					if rightEnabled {
						win.SendMessage(hwnd, win.WM_RBUTTONDOWN, 0, 0)
						win.SendMessage(hwnd, win.WM_RBUTTONUP, 0, 0)
						if ac.ClickingSound.Load() {
							PlaySound(pathPtr)
						}

						cps := 1000 / int64(cps[rand.Intn(len(cps))])
						time.Sleep(time.Duration(cps) * time.Millisecond)
					}

				} else {
					if isDown {
						win.SendMessage(hwnd, win.WM_RBUTTONDOWN, 0, 0)
						win.SendMessage(hwnd, win.WM_RBUTTONUP, 0, 0)
						if ac.ClickingSound.Load() {
							PlaySound(pathPtr)
						}

						cps := 1000 / int64(cps[rand.Intn(len(cps))])
						time.Sleep(time.Duration(cps) * time.Millisecond)
					}

				}
			}

			time.Sleep(1 * time.Millisecond)

		}

		time.Sleep(50 * time.Millisecond)
	}
}

func (ac *AutoClicker) Run() {
	go func() {
		for {
			windowName := ac.WindowName.Load().(string)

			if windowName != "" {
				hwnd := FindWindow(windowName)

				active := (hwnd == GetForegroundWindow() && !GetCursorVisible())

				if hwnd != ac.Hwnd.Load().(win.HWND) {
					fmt.Println(hwnd)
					ac.Hwnd.Store(hwnd)
				}

				if ac.Active.Load() != active {
					fmt.Println(active)
					ac.Active.Store(active)
				}
			} else {
				if ac.Active.Load() {
					ac.Active.Store(false)
				}
			}

			time.Sleep(50 * time.Millisecond)
		}
	}()

	go ac.AutoClicker()
}
