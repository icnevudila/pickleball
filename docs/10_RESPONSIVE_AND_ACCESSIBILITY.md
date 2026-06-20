# Responsive and Accessibility Guidelines

## Screen Types

The product has three screen types:

```txt
Mobile player phone
Admin desktop/tablet
Large TV display
```

Each has different layout needs.

## Player Mobile

Player booking must work best on phones.

Rules:

- Single-column cards
- Sticky booking CTA on session detail
- Large tap targets
- Clear payment status
- Avoid dense tables
- Use short labels

Minimum tap target:

```txt
44px height
```

## Admin Desktop

Admin should be optimized for:

```txt
Laptop
Desktop
Tablet landscape
```

Rules:

- Sidebar navigation
- Multi-column liveboard
- Tables allowed
- Keyboard search
- Quick actions visible

## Admin Mobile

MVP can support basic admin mobile, but live operations should target tablet/desktop.

Admin mobile rules:

- Stack court cards
- Queue below courts
- Use bottom action buttons
- Avoid drag/drop as only option

## TV Display

TV route should target:

```txt
1920x1080
```

Also support:

```txt
1366x768
4K screens
```

TV rules:

- No hover dependency
- No scroll for critical court state
- Large type
- High contrast
- Animation must be subtle

## Accessibility

### Color Contrast

Do not rely only on color.

Example:

Bad:

```txt
Green means available.
```

Good:

```txt
Green badge + text AVAILABLE.
```

### Keyboard

Admin controls should support keyboard where practical:

- Search players
- Tab through buttons
- Confirm modal with Enter/Escape

### Screen Readers

Player booking should be screen-reader friendly.

TV liveboard does not need full screen-reader optimization, but semantic HTML is still preferred.

### Motion

Avoid constant motion.

Respect reduced motion setting:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none;
    transition: none;
  }
}
```

## Accessibility Checklist

- [ ] Buttons have visible labels
- [ ] Inputs have labels
- [ ] Statuses include text, not only color
- [ ] Contrast is readable
- [ ] Player booking works on mobile
- [ ] Admin action buttons are large enough
- [ ] TV text is readable from distance
- [ ] Error states are clear
