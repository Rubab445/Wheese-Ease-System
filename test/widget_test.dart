import 'package:flutter_test/flutter_test.dart';

import 'package:wheezeease/main.dart';

void main() {
  testWidgets('App renders smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const WheezeEaseApp());
    await tester.pump();
    expect(find.byType(WheezeEaseApp), findsOneWidget);
  });
}
