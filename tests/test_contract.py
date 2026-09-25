import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]


class AppContract(unittest.TestCase):
    def test_html_form_fields_have_unique_ids(self):
        import re
        html = (ROOT / 'index.html').read_text()
        ids = re.findall(r'\bid="([^"]+)"', html)
        self.assertEqual(len(ids), len(set(ids)))
        for name in ('kind', 'language', 'headline', 'location', 'details', 'source', 'confirmed', 'verification'):
            self.assertIn(name, ids)

    def test_offline_manifest_files_exist(self):
        import re
        sw = (ROOT / 'sw.js').read_text()
        assets = re.findall(r"'\./([^']*)'", sw)
        for asset in assets:
            self.assertTrue((ROOT / (asset or 'index.html')).exists(), asset)

    def test_import_renders_as_text_and_checks_format(self):
        app = (ROOT / 'app.js').read_text()
        self.assertIn('textContent = value', app)
        self.assertIn("raw.format !== 'reliefpack-v1'", app)
        self.assertNotIn('innerHTML', app)


if __name__ == '__main__':
    unittest.main()
