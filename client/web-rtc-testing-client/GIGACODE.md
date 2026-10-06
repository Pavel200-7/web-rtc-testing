# Правила написания кода

1. **Никогда не добавляй HTML-элементы в composables.**
2. **Используй HTML-элементы только в файлах с расширением `.vue`.**
3. **Импорти — в одну строку:**

```ts
import { useFoo, useBar } from '@/composables'
```

4. **Деструктуризация из composables — по строкам:**

```ts
const { 
  foo,
  bar,
} = useFoo()
```
