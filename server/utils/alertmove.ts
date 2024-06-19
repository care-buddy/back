export function alertmove(path: string, msg: string) {
  return `<script>
    alert('${msg}')
    location.href = '${path}'
  </script>`;
}