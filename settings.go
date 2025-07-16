package main

import (
	"fmt"
	"os"

	"github.com/vmihailenco/msgpack/v5"
)

type Settings struct {
	LeftEnabled   bool
	RightEnabled  bool
	LeftKeybind   string
	RightKeybind  string
	LeftCps       []int
	RightCps      []int
	LeftToggle    bool
	RightToggle   bool
	ClickingSound bool
	WindowName    string
	Hotbar        []any
}

var VK_KEYS = map[string]int{
	"Left Button":   0x01,
	"Scroll Button": 0x04,
	"Right Button":  0x02,
	"Side Button 1": 0x06,
	"Side Button 2": 0x05,
}

func (a *App) UpdateSettings(settings Settings) {
	a.AutoClicker.LeftClick.Enabled.Store(settings.LeftEnabled)
	a.AutoClicker.RightClick.Enabled.Store(settings.RightEnabled)

	if _, exists := VK_KEYS[settings.LeftKeybind]; exists {
		a.AutoClicker.LeftClick.Keybind.Store(int32(VK_KEYS[settings.LeftKeybind]))
	} else if settings.LeftKeybind != "" {
		a.AutoClicker.LeftClick.Keybind.Store(int32(GetVK([]rune(settings.LeftKeybind)[0])))
	}

	if _, exists := VK_KEYS[settings.RightKeybind]; exists {
		a.AutoClicker.RightClick.Keybind.Store(int32(VK_KEYS[settings.RightKeybind]))
	} else if settings.RightKeybind != "" {
		a.AutoClicker.RightClick.Keybind.Store(int32(GetVK([]rune(settings.RightKeybind)[0])))
	}

	a.AutoClicker.LeftClick.Cps.Store(settings.LeftCps)
	a.AutoClicker.RightClick.Cps.Store(settings.RightCps)

	a.AutoClicker.LeftClick.Toggle.Store(settings.LeftToggle)
	a.AutoClicker.RightClick.Toggle.Store(settings.RightToggle)

	a.AutoClicker.WindowName.Store(settings.WindowName)

	a.AutoClicker.ClickingSound.Store(settings.ClickingSound)

	fmt.Println(settings.Hotbar)

	for index, item := range settings.Hotbar {
		m := item.(map[string]any)

		mode := m["mode"].(string)
		keybind := m["keybind"].(string)

		slot := &Slot{}
		slot.Mode.Store(mode)
		if keybind != "" {
			slot.Keybind.Store(int32(GetVK([]rune(keybind)[0])))
		}

		a.AutoClicker.Hotbar[index].Store(slot)
	}

	fmt.Println(settings)
}

func (a *App) SaveSettings(settings Settings) error {
	file, err := os.OpenFile("settings", os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	encoder := msgpack.NewEncoder(file)
	err = encoder.Encode(settings)
	if err != nil {
		return err
	}

	return nil
}

func (a *App) LoadSettings() (Settings, error) {
	file, err := os.OpenFile("settings", os.O_RDONLY|os.O_CREATE, 0644)
	if err != nil {
		return Settings{}, err
	}
	defer file.Close()

	decoder := msgpack.NewDecoder(file)
	var settings Settings
	err = decoder.Decode(&settings)
	if err != nil {
		return Settings{}, err
	}

	return settings, nil
}
