from PIL import Image

# Crop mobile screenshots to remove status bars and browser chrome
# Focus on just the app content

assets_dir = "/home/ubuntu/APEX-OS-PITCH-DECK/pitch-deck/assets"

# IMG_5171 - Player 1 connected view (dark terminal)
img1 = Image.open("/home/ubuntu/upload/IMG_5171(1).png")
w1, h1 = img1.size
print(f"IMG_5171: {w1}x{h1}")
# Crop: remove top status bar (~120px) and bottom nav (~120px)
# Keep the terminal content
top_crop = int(h1 * 0.07)   # ~7% from top (status bar)
bottom_crop = int(h1 * 0.03)  # ~3% from bottom
img1_cropped = img1.crop((0, top_crop, w1, h1 - bottom_crop))
img1_cropped.save(f"{assets_dir}/mobile-player1.png", quality=95)
print(f"Saved mobile-player1.png: {img1_cropped.size}")

# IMG_5172 - Player dashboard with scoring (dark terminal, scrolled)
img2 = Image.open("/home/ubuntu/upload/IMG_5172.png")
w2, h2 = img2.size
print(f"IMG_5172: {w2}x{h2}")
top_crop2 = int(h2 * 0.07)
bottom_crop2 = int(h2 * 0.06)  # remove bottom browser bar
img2_cropped = img2.crop((0, top_crop2, w2, h2 - bottom_crop2))
img2_cropped.save(f"{assets_dir}/mobile-dashboard.png", quality=95)
print(f"Saved mobile-dashboard.png: {img2_cropped.size}")

# IMG_5268 - Mobile responsive view (lighter bg, onboarding)
img3 = Image.open("/home/ubuntu/upload/IMG_5268.png")
w3, h3 = img3.size
print(f"IMG_5268: {w3}x{h3}")
top_crop3 = int(h3 * 0.06)
bottom_crop3 = int(h3 * 0.04)
img3_cropped = img3.crop((0, top_crop3, w3, h3 - bottom_crop3))
img3_cropped.save(f"{assets_dir}/mobile-onboarding.png", quality=95)
print(f"Saved mobile-onboarding.png: {img3_cropped.size}")

# Desktop pill choice - crop to just the terminal window area
img4 = Image.open("/home/ubuntu/upload/Screenshot2026-02-13at16.34.00.png")
w4, h4 = img4.size
print(f"Pill choice: {w4}x{h4}")
# This is already a clean desktop screenshot, just save as-is
img4.save(f"{assets_dir}/desktop-pillchoice.png", quality=95)
print(f"Saved desktop-pillchoice.png: {img4.size}")

# Desktop terminal full view
img5 = Image.open("/home/ubuntu/upload/Screenshot2026-02-12at18.28.092.png")
w5, h5 = img5.size
print(f"Desktop terminal: {w5}x{h5}")
img5.save(f"{assets_dir}/desktop-terminal-full.png", quality=95)
print(f"Saved desktop-terminal-full.png: {img5.size}")

print("\nAll images cropped and saved!")
